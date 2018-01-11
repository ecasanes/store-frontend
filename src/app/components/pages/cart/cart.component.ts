import {Component, OnInit} from "@angular/core";
import {Response} from "@angular/http";
import {Router} from "@angular/router";

import {
    AlertService,
    AuthService,
    DashboardEventService,
    ProductService
} from "../../../shared";

import {
    Product,
    ProductCategory
} from '../../../classes';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    products: Product[] = [];
    categories: ProductCategory[];

    totalPrice: number = 0;
    totalShippingFee: number = 0;

    productsMaxLength: number;
    productsCurrentLength: number;
    productsLimit: number;
    productsCurrentPage: number = 1;

    panelTitle: string = "Products";

    userId: number = null;
    categoryId: number = null;

    query: string = "";

    loadingData: boolean = false;

    constructor(public router: Router,
                private authService: AuthService,
                private productService: ProductService,
                private dashboardEventService: DashboardEventService,
                private alertService: AlertService) {
        this.userId = this.authService.getUserId();
    }

    ngOnInit() {
        this.getProducts();
    }

    getProducts() {

        this.loadingData = true;

        const currentPage = this.productsCurrentPage;
        const categoryId = this.categoryId;
        const query = this.query;
        const userId = this.userId;

        this.productService.getProducts(currentPage, categoryId, query, 'none', userId)
            .subscribe(
                (response) => {
                    this.products = response.data;
                    this.productsLimit = response.limit;
                    this.productsCurrentLength = response.data.length;
                    this.productsMaxLength = response.length;
                    this.loadingData = false;

                    this.calculateTotalPrice();
                    this.calculateTotalShippingFee();

                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }
            )
    }

    onRemoveInCart(product: Product) {

        this.productService.removeInCart(this.userId, product.product_variation_id)
            .subscribe(
                (response) => {
                    this.getProducts();
                    product.in_cart = 0;
                    this.dashboardEventService.onCartChange.emit(true);
                    this.calculateTotalPrice();
                    this.calculateTotalShippingFee();
                },
                (error) => {
                    console.log('something went wrong while adding to wishlist', error);
                }
            )

    }

    calculateTotalPrice() {

        let total = 0;

        this.products.forEach(
            (product) => {
                if(product.in_cart == 1 && product.total_branch_quantity>0){
                    total += parseFloat(product.cart_quantity*product.selling_price+'');
                }
            }
        )

        this.totalPrice = total;

    }

    calculateTotalShippingFee() {

        let total = 0;

        this.products.forEach(
            (product) => {
                if(product.in_cart == 1 && product.total_branch_quantity>0){
                    total += parseFloat(product.cart_quantity*product.shipping_price+'');
                }
            }
        )

        this.totalShippingFee = total;

    }

    onCheckout() {
        this.router.navigateByUrl('/checkout');
    }

    onIncrementCartQuantity(product: Product) {

        const stocksLeft = parseFloat(product.total_branch_quantity+'');
        const cartQuantity = parseFloat(product.cart_quantity+'');
        const newQuantity = cartQuantity+1;

        if(stocksLeft<newQuantity){
            this.noStocksLeft(product);
            return;
        }

        this.productService.addToCart(this.userId, product.product_variation_id, newQuantity)
            .subscribe(
                (response) => {
                    product.cart_quantity = newQuantity;
                    this.calculateTotalPrice();
                    this.calculateTotalShippingFee();
                },
                (error) => {
                    console.log('something went wrong while incrementing product quantity', error);
                }
            )

    }

    onDecrementCartQuantity(product: Product) {

        const cartQuantity = parseFloat(product.cart_quantity+'');
        const newQuantity = cartQuantity-1;

        if(cartQuantity==1){
            this.removeFromCart(product);
            return;
        }

        this.productService.addToCart(this.userId, product.product_variation_id, newQuantity)
            .subscribe(
                (response) => {
                    product.cart_quantity = newQuantity;
                    this.calculateTotalPrice();
                    this.calculateTotalShippingFee();
                },
                (error) => {
                    console.log('something went wrong while incrementing product quantity', error);
                }
            )

    }

    removeFromCart(product: Product) {

        this.alertService.confirmDelete("Remove from cart?","","Yes")
            .then(() => {
                this.onRemoveInCart(product);
            })
            .catch(() => {
            });

    }

    noStocksLeft(product: Product) {

        this.alertService.confirmSuccess("Cannot increase value", "There is only " + parseInt(product.total_branch_quantity+'') + " stocks left.", "OK")
            .then(() => {

            })
            .catch(() => {
            });

    }

}
