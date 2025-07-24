import { Component, inject, Input } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { ConfirmationToken } from '@stripe/stripe-js';
import { AddressPipe } from "../../../shared/pipes/address.pipe";
import { PaymentCartPipe } from "../../../shared/pipes/payment-cart.pipe";


@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [AddressPipe, PaymentCartPipe],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss'
})
export class CheckoutReviewComponent {
  cartService = inject(CartService);
  @Input()   confirmationToken?: ConfirmationToken;

}
