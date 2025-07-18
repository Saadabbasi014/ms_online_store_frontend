import { Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    CurrencyPipe,
    MatButton,
    MatCardActions,
    MatIcon,
    RouterLink
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent  {

 @Input() product?: Product;
 cartService = inject(CartService);

  addToCart(product: Product|undefined) {
    if (product !== undefined) {
      this.cartService.addItemToCart(product);
    }
  }
}
