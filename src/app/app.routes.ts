import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { CartComponent } from './features/cart/cart.component';

export const routes: Routes = [
    {path : '', component : HomeComponent},
    {path : 'shop', component : ShopComponent},
    {path : 'shop/:id', component : ProductDetailsComponent},
    {path: 'cart', component: CartComponent},
    {path : '**', redirectTo : '', pathMatch: 'full'},
];
