import { Component, input } from '@angular/core';
import { CartItemType } from '../../../shared/models/cart';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItemType>();
}
