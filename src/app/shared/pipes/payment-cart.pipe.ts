import { Pipe, PipeTransform } from '@angular/core';
import { Cart } from '../models/cart';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'paymentCart',
  standalone: true
})
export class PaymentCartPipe implements PipeTransform {

  transform(value?: ConfirmationToken['payment_method_preview'], ...args: unknown[]): unknown {
    if(value?.card){
      const {brand, last4, exp_month, exp_year} = value.card;
      return `${brand.toLocaleUpperCase()}, ${'**** **** **** ' + last4}, Exp: ${exp_month}/${exp_year}`
    }else{
      throw new Error('Unknown Payment Method.');
    }
  }

}
