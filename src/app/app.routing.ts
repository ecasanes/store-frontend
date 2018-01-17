import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";

import {
    DashboardComponent,
    ProductsComponent,
    SigninComponent,
    DashboardIndexComponent,
    PageNotFoundComponent

} from "./components";

import {
    AuthGuard,
} from "./shared";
import {DashboardGuard} from "./shared/guards/dashboard.guard";
import {ProfileComponent} from "./components/pages/profile/profile.component";
import {SellersComponent} from "./components/pages/sellers/sellers.component";
import {SellerTransactionsComponent} from "./components/pages/seller-transactions/seller-transactions.component";
import {SellerProductsComponent} from "./components/pages/seller-products/seller-products.component";
import {BuyersComponent} from "./components/pages/buyers/buyers.component";
import {BuyerTransactionsComponent} from "./components/pages/buyer-transactions/buyer-transactions.component";
import {VouchersComponent} from "./components/pages/vouchers/vouchers.component";
import {CartComponent} from "./components/pages/cart/cart.component";
import {BuyerOrdersComponent} from "./components/pages/buyer-orders/buyer-orders.component";
import {WishlistComponent} from "./components/pages/wishlist/wishlist.component";
import {SellerOrdersComponent} from "./components/pages/seller-orders/seller-orders.component";
import {AllSellerProductsComponent} from "./components/pages/all-seller-products/all-seller-products.component";
import {CheckoutComponent} from "./components/pages/checkout/checkout.component";
import {PublicProductsComponent} from "./components/pages/public-products/public-products.component";
import {GuestGuard} from "./shared/guards/guest.guard";
import {BuyerGuard} from "./shared/guards/buyer.guard";


const APP_ROUTES: Routes = [

    {path: 'signin', component: SigninComponent},
    {path: 'dashboard-products', component: PublicProductsComponent, canActivate: []},

    // canActivate: [UserGuard]

    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: DashboardIndexComponent, canActivate: [DashboardGuard]},

            {path: 'profile', component: ProfileComponent, canActivate: []},

            // admin
            {path: 'sellers', component: SellersComponent, canActivate: []},
            {path: 'sellers/transactions', component: SellerTransactionsComponent, canActivate: []},
            {path: 'sellers/products', component: AllSellerProductsComponent, canActivate: []},
            {path: 'buyers', component: BuyersComponent, canActivate: []},
            {path: 'buyers/transactions', component: BuyerTransactionsComponent, canActivate: []},
            {path: 'vouchers', component: VouchersComponent, canActivate: []},

            // buyer
            {path: 'products', component: ProductsComponent, canActivate: [BuyerGuard]},
            {path: 'cart', component: CartComponent, canActivate: []},
            {path: 'buyer-orders', component: BuyerOrdersComponent, canActivate: []},
            {path: 'wishlist', component: WishlistComponent, canActivate: []},
            {path: 'checkout', component: CheckoutComponent, canActivate: []},

            // seller
            {path: 'seller-products', component: SellerProductsComponent, canActivate: []},
            {path: 'seller-orders', component: SellerOrdersComponent, canActivate: []},
        ]
    },

    {path: '404', component: PageNotFoundComponent},

    // otherwise redirect to home
    {path: '**', redirectTo: '404'}


];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);