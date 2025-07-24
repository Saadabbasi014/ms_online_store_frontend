import { inject, Injectable } from '@angular/core';
import { Stripe, loadStripe, StripeElements, StripeAddressElement, StripeAddressElementOptions, StripePaymentElement, ConfirmationToken } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '../../shared/models/cart';
import { firstValueFrom, map } from 'rxjs';
import { AccountService } from './account.service';
import { __values } from 'tslib';
@Injectable({
  providedIn: 'root'
})
export class StripeService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private stripePromice: Promise<Stripe | null>;
  private elements?: StripeElements;
  private addressElements?: StripeAddressElement;
  private paymentElement?: StripePaymentElement;

  constructor() {
    this.stripePromice = loadStripe(environment.Publishablekey);
    console.log("getStripeInstance called", this.getStripeInstance());
  }

  getStripeInstance() {
    return this.stripePromice;
  }

  async initializeElements() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.creteOrUpdateStripeIntent());
        console.log("cart=======>", cart)
        this.elements = stripe.elements({
          clientSecret: cart.clientSecret,
          appearance: { labels: 'floating' }
        });
      } else {
        throw new Error('Stripe not initialized');
      }
    }
    return this.elements;
  }

  async createPaymentElement(){
    if(!this.paymentElement){
      const elements = await this.initializeElements();
      if(elements){
        this.paymentElement = elements.create('payment');
      }else{
        throw new Error("Element instence has not been initialized."); 
      }
    }
    return this.paymentElement;
  }

  async creteAddressElement() {
    if (!this.addressElements) {
      const elements = await this.initializeElements();
      if (elements) {
        const user = this.accountService.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};
        if (user) {
          defaultValues.name = user.firstName + ' ' + user.lastName;
          console.log('User address:', user);
          if (user.address) {
            defaultValues.address = {
              line1: user.address.line1,
              line2: user.address.line2,
              city: user.address.city,
              state: user.address.state,
              postal_code: user.address.postalCode,
              country: user.address.country
            }
          }
        }
        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues,
        };
        this.addressElements = elements.create('address', options);
      } else {
        throw new Error('Stripe Elements not initialized');
      }
    }
    return this.addressElements;
  }

  

  async creteConfirmationToken(){
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();
    const result = await elements.submit();

    if(result.error) throw new Error(result.error?.message);
    if(stripe){
      return await stripe.createConfirmationToken({elements});
    }else{
      throw new Error("Stripe not available");
    }
  }

    async confirmPayment(confirmationToken : ConfirmationToken){
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();
    const result = await elements.submit();
    const clientSecret = this.cartService.cart()?.clientSecret;
    if(result.error) throw new Error(result.error?.message);
    if(stripe && clientSecret){
      return await stripe.confirmPayment({
        clientSecret: clientSecret,
        confirmParams:{
          confirmation_token: confirmationToken.id
        },
        redirect: 'if_required'
      })
    }else{
      throw new Error("Unable to load stripe");
    }
  }

  creteOrUpdateStripeIntent() {
    const cart = this.cartService.cart();
    if (!cart) throw new Error('Cart is empty');
    return this.http.post<Cart>(`${this.baseUrl}payments/${cart.id}`, cart, {}).pipe(
      map(cart => {
        this.cartService.setCart(cart);
        return cart;
      })
    );
  }

  disposeElements() {
    this.elements = undefined;
    this.addressElements = undefined;
    this.paymentElement = undefined;
  }
}
