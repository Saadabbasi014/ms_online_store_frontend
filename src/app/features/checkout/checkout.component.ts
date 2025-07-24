import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { MatStepper, matStepperAnimations, MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user';
import { AccountService } from '../../core/services/account.service';
import { findIndex, firstValueFrom } from 'rxjs';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    OrderSummaryComponent,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe,
    JsonPipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {

  private stripeService = inject(StripeService);
  private accountService = inject(AccountService);
  cartService = inject(CartService)
  private router = inject(Router);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  private snackBar = inject(SnackbarService);
  saveAddress = false;
  confirmationToken?: ConfirmationToken;

  completionStatus = signal<{ address: boolean, cart: boolean, delivery: boolean }>(
    { address: false, delivery: false, cart: false }
  )

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.creteAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on("change", this.handleAddressChange);

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on("change", this.handlePaymentChange);

    } catch (error: any) {
      this.snackBar.error(error.message);
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state;
    })
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.cart = event.complete;
      return state;
    })
  }

  handleDeliveryChange(event: boolean){
    this.completionStatus.update(state =>{
      state.delivery = event;
      return state;
    })
  }

  async getConfirmationToken(){
    try{
      if(Object.values(this.completionStatus()).every(status => status === true)){
        const result = await this.stripeService.creteConfirmationToken();
        if(result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
        console.log("this.confirmationToken", this.confirmationToken);
      }
    }catch(error: any){
      this.snackBar.error(error.message);
    }
  }

  async onStepChange($event: StepperSelectionEvent) {
    if ($event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }

    if ($event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.creteOrUpdateStripeIntent())
    }

    if($event.selectedIndex === 3){
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper){
    try{
      if(this.confirmationToken){
        const result = await this.stripeService.confirmPayment(this.confirmationToken);
        if(result.error) {
          throw new Error(result.error.message)
        }else{
          const result = this.cartService.deletecart(this.confirmationToken.id); // i think it will not execute sussessfully. 
          console.log("deletecart", result);
          this.cartService.selectedDelivery.set(null);
          this.router.navigateByUrl("/checkout/success");

        }
      }
    }catch(error: any){
      this.snackBar.error(error.message || "Something went wrong");
      stepper.previous();
    }
  }

  private async getAddressFromStripeAddress(): Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value?.address;

    if (address) {
      return {
        line1: address.line1,
        line2: address.line2!,
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        country: address.country
      };
    } else
      return null;

  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  ngOnDestroy() {
    this.stripeService.disposeElements();
  }
}
