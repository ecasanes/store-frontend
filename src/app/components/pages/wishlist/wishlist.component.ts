import {Component, OnInit} from "@angular/core";
import {Response} from "@angular/http";
import {Router} from "@angular/router";

import {
    AuthService,
    CategoryService,
    DashboardEventService,
    ProductService,
} from "../../../shared";

import {
    Product,
    ProductCategory
} from '../../../classes';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

    products: Product[] = [];
    categories: ProductCategory[];

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
                private categoryService: CategoryService,
                private dashboardEventService: DashboardEventService,
    ) {
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
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }
            )
    }

    getCategories() {

        this.categoryService.getCategories()
            .subscribe(
                (response) => {
                    this.categories = response.data;
                    this.dashboardEventService.onGetCategories.emit(this.categories);
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onRemoveInWishList(product: Product) {

        this.productService.removeInWishlist(this.userId, product.product_variation_id)
            .subscribe(
                (response) => {
                    this.getProducts();
                    product.in_wishlist = 0;
                },
                (error) => {
                    console.log('something went wrong while adding to wishlist', error);
                }
            )

    }

    wishlistsCount() {

        let count = 0;

        this.products.forEach(
            (product) => {
                if (product.in_wishlist == 1) {
                    count++;
                }
            }
        );

        return count;

    }

}
