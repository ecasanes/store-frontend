import {Component, OnDestroy, OnInit} from "@angular/core";
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
import {CategoryService} from "../../../shared/services/api/category.service";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, OnDestroy {

    products: Product[] = [];
    categories: ProductCategory[] = [];

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
                private alertService: AlertService,
                private categoryService: CategoryService
    ) {
        this.userId = this.authService.getUserId();
    }

    ngOnInit() {
        this.getProducts();
        this.getCategories();
    }

    ngOnDestroy() {
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
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }
            )
    }

    onAddToCart(product: Product) {

        if (product.total_branch_quantity <= 0) {
            this.noStocksLeft(product);
            return;
        }

        this.alertService.input("Input Quantity").then(
            (quantity:number) => {

                if(quantity>product.total_branch_quantity){
                    this.notEnoughStocks(product);
                    return;
                }

                product.quantity = quantity;
                this.addToCart(product);
            }
        );


    }

    addToCart(product: Product) {

        this.productService.addToCart(this.userId, product.product_variation_id, product.quantity)
            .subscribe(
                (response) => {
                    product.in_cart = 1;
                    this.dashboardEventService.onCartChange.emit(true);
                },
                (error) => {
                    console.log('something went wrong while adding to wishlist', error);
                }
            )

    }

    noStocksLeft(product: Product) {

        this.alertService.confirmDelete("Cannot Add to Cart", "Add to wishlist instead?", "Yes, add to wishlist")
            .then(() => {
                this.onAddToWishList(product);
            })
            .catch(() => {
            });

    }

    notEnoughStocks(product: Product) {

        this.alertService.confirmSuccess("Cannot Add to Cart", "Not enough stocks for "+product.name, "Ok")
            .then(() => {
            })
            .catch(() => {
            });

    }

    onRemoveInCart(product: Product) {

        this.productService.removeInCart(this.userId, product.product_variation_id)
            .subscribe(
                (response) => {
                    product.in_cart = 0;
                    this.dashboardEventService.onCartChange.emit(true);
                },
                (error) => {
                    console.log('something went wrong while adding to wishlist', error);
                }
            )

    }

    onAddToWishList(product: Product) {

        console.log('user id: ', this.userId);
        console.log('prod id: ', product.product_variation_id);

        this.productService.addToWishlist(this.userId, product.product_variation_id)
            .subscribe(
                (response) => {
                    product.in_wishlist = 1;
                },
                (error) => {
                    console.log('something went wrong while adding to wishlist', error);
                }
            )

    }

    onRemoveInWishList(product: Product) {

        this.productService.removeInWishlist(this.userId, product.product_variation_id)
            .subscribe(
                (response) => {
                    product.in_wishlist = 0;
                },
                (error) => {
                    console.log('something went wrong while adding to wishlist', error);
                }
            )

    }


    getCategories() {

        this.categoryService.getCategories(true)
            .subscribe(
                (response) => {
                    this.categories = response.data;
                },
                (error) => {
                    console.log('something went wrong while fetching categories', error);
                }
            )

    }

    showByCategory(categoryId: number) {

        this.categoryId = categoryId;
        this.getProducts();

    }

    getAllProducts() {

        this.categoryId = null;
        this.getProducts();

    }

}
