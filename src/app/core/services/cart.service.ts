import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItemType } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  })

  addItemToCart(item: CartItemType | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    console.log('Current cart:', cart);
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item as Product);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  addOrUpdateItem(items: CartItemType[], item: CartItemType, quantity: number): CartItemType[] {
    const existingItemIndex = items.findIndex(i => i.productId === item.productId);
    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += quantity;
      if (items[existingItemIndex].quantity <= 0) {
        items.splice(existingItemIndex, 1);
      }
    } else {
      item.quantity = quantity;
      items.push(item);
    }
    // this.setCart(new Cart(items));
    return items;
  }

  mapProductToCartItem(item: Product): CartItemType {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imgUrl,
      brand: item.brand,
      type: item.type
    };
  }

  private isProduct(item: CartItemType | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart(): Cart {
    const newCart = new Cart();
    localStorage.setItem('cart_id', newCart.id);
    return newCart;
  }

  // getCart(id: string) {
  //   return this.http.get<Cart>(this.baseUrl + 'cart/' + id).pipe(
  //     map(cart => {
  //       this.cart.set(cart);
  //       return cart;
  //     })
  //   );
  // };

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart/' + id).subscribe({
      next: (cart) => this.cart.set(cart),
      error: (error) => console.error('Error fetching cart:', error),
    });
  };

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: (cart) => this.cart.set(cart),
      error: (error) => console.error('Error setting cart:', error),
    });
  }

  deletecart(id: string) {
    return this.http.delete(this.baseUrl + 'cart/' + id).subscribe({
      next: () => this.cart.set(null),
      error: (error) => console.error('Error deleting cart:', error),
    });
  }
}
