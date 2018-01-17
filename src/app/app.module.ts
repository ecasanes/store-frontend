import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {routing} from "./app.routing";

import {SweetAlertService} from 'ngx-sweetalert2';

import {
    ProductsComponent,
    SigninComponent,
    DashboardComponent,
    DashboardPanelComponent,
    DashboardIndexComponent,
    AddProductModalComponent,
    ErrorHandlerComponent,
    ConfirmLoginModalComponent,
    PageNotFoundComponent,
    EditProductModalComponent,
    AlertErrorHandlerComponent,
    PanelLoadingComponent,
    ButtonLoadingComponent,
    ViewTransactionModalComponent,

} from './components';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {NgbActiveModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {
    ModalService,
    HttpService,
    RouterService,
    DashboardEventService,
    GuestGuard,
    AuthGuard,
    BuyerGuard,
    DashboardGuard,
    ProductService,
    AuthService,
    CategoryService,
    ErrorResponseService,
    UserService,
    AlertService,
    TransactionService,
} from "./shared";
import {TruncateModule} from "ng2-truncate";

import { ProfileComponent } from './components/pages/profile/profile.component';
import { SellersComponent } from './components/pages/sellers/sellers.component';
import { SellerTransactionsComponent } from './components/pages/seller-transactions/seller-transactions.component';
import { TransactionsComponent } from './components/pages/transactions/transactions.component';
import { SellerProductsComponent } from './components/pages/seller-products/seller-products.component';
import { BuyersComponent } from './components/pages/buyers/buyers.component';
import { BuyerTransactionsComponent } from './components/pages/buyer-transactions/buyer-transactions.component';
import { VouchersComponent } from './components/pages/vouchers/vouchers.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { BuyerOrdersComponent } from './components/pages/buyer-orders/buyer-orders.component';
import { SellerOrdersComponent } from './components/pages/seller-orders/seller-orders.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { RegisterBuyerComponent } from './components/pages/register-buyer/register-buyer.component';
import { PanelTitleComponent } from './components/directives/panel-title/panel-title.component';
import { AddSellerModalComponent } from './components/modals/add/add-seller-modal/add-seller-modal.component';
import { AddStockModalComponent } from './components/modals/add/add-stock-modal/add-stock-modal.component';
import { AllSellerProductsComponent } from './components/pages/all-seller-products/all-seller-products.component';
import { EditUserModalComponent } from './components/modals/edit/edit-user-modal/edit-user-modal.component';
import { FilterPipe } from './components/pipes/filter.pipe';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { AddVoucherModalComponent } from './components/modals/add/add-voucher-modal/add-voucher-modal.component';
import { EditVoucherModalComponent } from './components/modals/edit/edit-voucher-modal/edit-voucher-modal.component';
import { AddBuyerModalComponent } from './components/modals/add/add-buyer-modal/add-buyer-modal.component';
import { PublicProductsComponent } from './components/pages/public-products/public-products.component';
import { LoginModalComponent } from './components/modals/action/login-modal/login-modal.component';
import { EditPasswordModalComponent } from './components/modals/edit/edit-password-modal/edit-password-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        ProductsComponent,
        SigninComponent,
        DashboardComponent,
        DashboardPanelComponent,
        DashboardIndexComponent,
        AddProductModalComponent,
        ErrorHandlerComponent,
        ConfirmLoginModalComponent,
        PageNotFoundComponent,
        EditProductModalComponent,
        AlertErrorHandlerComponent,
        PanelLoadingComponent,
        ButtonLoadingComponent,
        ViewTransactionModalComponent,
        ProfileComponent,
        SellersComponent,
        SellerTransactionsComponent,
        TransactionsComponent,
        SellerProductsComponent,
        BuyersComponent,
        BuyerTransactionsComponent,
        VouchersComponent,
        CartComponent,
        BuyerOrdersComponent,
        SellerOrdersComponent,
        WishlistComponent,
        RegisterBuyerComponent,
        PanelTitleComponent,
        AddSellerModalComponent,
        AddStockModalComponent,
        AllSellerProductsComponent,
        EditUserModalComponent,
        FilterPipe,
        CheckoutComponent,
        AddVoucherModalComponent,
        EditVoucherModalComponent,
        AddBuyerModalComponent,
        PublicProductsComponent,
        LoginModalComponent,
        EditPasswordModalComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        BrowserAnimationsModule,
        TruncateModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true
        }),
        NgbModule.forRoot()
    ],
    providers: [
        NgbActiveModal,
        SweetAlertService,
        ModalService,
        HttpService,
        RouterService,
        DashboardEventService,
        AuthGuard,
        BuyerGuard,
        GuestGuard,
        DashboardGuard,
        ProductService,
        AuthService,
        CategoryService,
        ErrorResponseService,
        UserService,
        AlertService,
        TransactionService,
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        AddProductModalComponent,
        ConfirmLoginModalComponent,
        EditProductModalComponent,
        ViewTransactionModalComponent,
        AddSellerModalComponent,
        AddStockModalComponent,
        EditUserModalComponent,
        AddVoucherModalComponent,
        EditVoucherModalComponent,
        AddBuyerModalComponent,
        LoginModalComponent,
        EditPasswordModalComponent
    ]
})

export class AppModule {
}
