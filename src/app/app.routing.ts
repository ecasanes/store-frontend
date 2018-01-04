import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";

import {
    DashboardComponent,
    ProductsComponent,
    CategoriesComponent,
    SigninComponent,
    DashboardIndexComponent,
    DeliveriesComponent,
    PricingComponent,
    CustomersComponent,
    ReportsComponent,
    SalesComponent,
    AdjustmentsComponent,
    StaffComponent,
    StoresComponent,
    ManagersComponent,
    PageNotFoundComponent,
    ActivitiesComponent

} from "./components";

import {
    AuthGuard,
    CompanyGuard,
    CompanyStaffInventoryGuard,
    CompanyStaffSalesGuard
} from "./shared";
import {DashboardGuard} from "./shared/guards/dashboard.guard";
import {StocksComponent} from "./components/pages/stocks/stocks.component";
import {FranchiseesComponent} from "./components/pages/franchisees/franchisees.component";


const APP_ROUTES: Routes = [

    {path: 'signin', component: SigninComponent},

    // canActivate: [UserGuard]

    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: DashboardIndexComponent, canActivate: [DashboardGuard]},
            {path: 'pricing', component: PricingComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'deliveries', component: DeliveriesComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'customers', component: CustomersComponent, canActivate: [CompanyGuard]},
            {path: 'reports', component: ReportsComponent, canActivate: [CompanyGuard]},
            {path: 'sales', component: SalesComponent, canActivate: [CompanyStaffSalesGuard]},
            {path: 'adjustments', component: AdjustmentsComponent, canActivate: [CompanyStaffSalesGuard]},
            {path: 'staff', component: StaffComponent, canActivate: [CompanyGuard]},
            {path: 'stores', component: StoresComponent, canActivate: [CompanyGuard]},
            {path: 'managers', component: ManagersComponent, canActivate: [CompanyGuard]},
            {path: 'franchisees', component: FranchiseesComponent, canActivate: [CompanyGuard]},
            {path: 'products', component: ProductsComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'categories', component: CategoriesComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'activities', component: ActivitiesComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'stocks', component: StocksComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'products/categories/:category_id', component: ProductsComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'stocks/branches/:branch_id', component: StocksComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'customers/branch/:branch_id', component: CustomersComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'activities/transaction/:transaction_activity_type_id', component: ActivitiesComponent, canActivate: [CompanyStaffInventoryGuard]},
            {path: 'sales/branch/:branch_id', component: SalesComponent, canActivate: [CompanyStaffInventoryGuard]}
        ]
    },

    {path: '404', component: PageNotFoundComponent},

    // otherwise redirect to home
    {path: '**', redirectTo: '404'}


];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);