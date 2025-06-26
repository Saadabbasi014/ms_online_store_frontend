import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    CurrencyPipe,
    MatButton,
    MatCardActions,
    MatIcon
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnInit {

 @Input() product?: Product;

  ngOnInit(): void {
    // console.log('Product received in ProductItemComponent:', this.product);
  }

  addToCart(product: Product|undefined) {
     console.log('Add to cart clicked:', product);
  }
}
