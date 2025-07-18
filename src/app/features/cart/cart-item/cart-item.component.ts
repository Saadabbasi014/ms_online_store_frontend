import { Component, inject, input } from '@angular/core';
import { CartItemType } from '../../../shared/models/cart';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    DecimalPipe
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItemType>();
  cartService = inject(CartService);

  increaseQuantity() {
    this.cartService.increaseQuantity(this.item());
  }

  decreaseQuantity() {
    this.cartService.decreaseQuantity(this.item());
  }

  removeItemFromCart() {
    this.cartService.removeItemFromCart(this.item().productId, this.item().quantity,);
  }

}
