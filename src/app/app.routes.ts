import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { CheckoutSuccessComponent } from './features/checkout/checkout-success/checkout-success.component';
import { OrderComponent } from './features/orders/order.component';
import { OrderDetailedComponent } from './features/orders/order-detailed/order-detailed.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'shop/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'account/login', component: LoginComponent },
    { path: 'account/register', component: RegisterComponent },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
    { path: 'checkout/success', component: CheckoutSuccessComponent, canActivate: [authGuard] },
    { path: 'orders/:id', component: OrderDetailedComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrderComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
