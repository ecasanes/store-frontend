import {Component, OnInit} from "@angular/core";
import {Response} from "@angular/http";
import {Router} from "@angular/router";

import {
    AuthService,
    ModalService,
    ProductService,
} from "../../../shared";

import {
    Product,
    ProductCategory
} from '../../../classes';
import {LoginModalComponent} from "../../modals/action/login-modal/login-modal.component";
import {AddBuyerModalComponent} from "../../modals/add/add-buyer-modal/add-buyer-modal.component";

@Component({
    selector: 'app-public-products',
    templateUrl: './public-products.component.html',
    styleUrls: ['./public-products.component.scss']
})
export class PublicProductsComponent implements OnInit {

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
                private modalService: ModalService,
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

    onAddToCart(product: Product) {

        this.onLogin()

    }

    onAddToWishList(product: Product) {

        this.onLogin();

    }

    onLogin() {

        const modalRef = this.modalService.open(LoginModalComponent, null, true);

        modalRef.result
            .then(
                (results) => {
                    this.getProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onSignup() {

        const modalConfig = {
            size: 'lg'
        };

        const modalRef = this.modalService.open(AddBuyerModalComponent, null, true);
        modalRef.componentInstance.action = 'register';

        modalRef.result
            .then(
                (results) => {
                    console.log('modal dismissed');
                    this.getProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

}
