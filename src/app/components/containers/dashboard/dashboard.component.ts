import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {
    AuthService,
    DashboardEventService
} from "../../../shared";

import {ProductCategory} from '../../../classes';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {ProductService} from "../../../shared/services/api/product.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    [x: string]: any;

    panelTitle: string;
    panelDescription: string;

    currentUser: User = new User();

    hasAdminPrivileges: boolean = false;
    hasBuyerPrivileges: boolean = false;
    hasSellerPrivileges: boolean = false;

    cartCount: number = 0;

    currentNav: string = "";

    categories: ProductCategory[];

    searchKey: string = "";

    searchIsOn: boolean = true;

    constructor(private authService: AuthService,
                private router: Router,
                private dashboardEventService: DashboardEventService,
                private userService: UserService,
                private productService: ProductService
    ) {

        this.initializeSubscriptions();
        this.getCurrentCartCount();
    }

    initializeSubscriptions() {

        this.dashboardEventService.onCartChange.subscribe(
            (hasChanged) => {
                this.getCurrentCartCount()
            },
            (errorRes) => {
                console.log('Error while getting cart change subscription: ', errorRes)
            }
        );

    }

    ngOnInit() {

        document.body.classList.remove("login");
        document.body.classList.add("dashboard");

        this.getCurrentUser();
        this.getPrivileges();

    }

    setCurrentNav(currentNav) {

        console.log('set current nav called');

        if (this.currentNav === currentNav) {
            this.currentNav = "";
            return false;
        }

        this.currentNav = currentNav;

        console.log(currentNav);

        switch (this.currentNav) {
            case 'dashboard':
                this.router.navigateByUrl('/');
                break;
            default:
                this.router.navigateByUrl('/'+this.currentNav);
                break;

        }
    }

    logout() {
        this.authService.removeToken();
        this.router.navigate(['/dashboard-products'])
            .then(function () {
                console.log('logged out');
            })
    }

    goToProfilePage() {
        this.router.navigate(['/profile'])
            .then(function () {
                console.log('gone to profile page');
            })
    }

    getPrivileges() {

        this.hasAdminPrivileges = this.authService.validateAdminPrivileges();
        this.hasSellerPrivileges = this.authService.validateSellerPrivileges();
        this.hasBuyerPrivileges = this.authService.validateBuyerPrivileges();
    }

    getCurrentUser() {

        this.userService.getCurrentUserProfile()
            .subscribe(
                (response) => {
                    this.currentUser = response.data;
                }
            )

    }

    getCurrentCartCount() {

        const userId = this.authService.getUserId();

        this.productService.getCurrentCartCount(userId)
            .subscribe(
                (response) => {
                    this.cartCount = parseInt(response);
                },
                (error) => {
                    console.log('something went wrong while getting current cart count: ', error);
                }
            )

    }

    goToCartPage(){
        this.router.navigateByUrl('/cart');
    }

}
