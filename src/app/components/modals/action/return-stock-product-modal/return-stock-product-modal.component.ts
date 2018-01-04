import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    ProductService,
    ErrorResponseService
} from "../../../../shared";

import {
    Product,
    ProductCategory,
    ErrorResponse
} from '../../../../classes';

@Component({
    selector: 'app-return-stock-product-modal',
    templateUrl: './return-stock-product-modal.component.html',
    styleUrls: ['./return-stock-product-modal.component.css']
})
export class ReturnStockProductModalComponent implements OnInit {

    @Input() product: Product = new Product();

    categories: ProductCategory[];
    productImage: File;
    productImageName: string = "";

    updating: boolean = false;

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private productService: ProductService,
                private errorResponseService: ErrorResponseService) {
        this.checkSession();
        this.getCategories();
    }

    ngOnInit() {
    }

    checkSession() {

        this.authService.dismissCurrentModal.subscribe(
            needsAuth => {

                if (needsAuth) {
                    console.log('Session has expired! Modal will  be closed');
                    setTimeout(() => {
                        this.activeModal.dismiss({message: "Session has expired!"});
                    }, 100);
                    //this.authService.showModal.emit(true);
                    this.authService.confirm.emit(true);
                }

            },
            error => {
                console.log('error', error)
            }
        )
    }

    getCategories() {
        this.productService.getCategoriesFromModal()
            .subscribe(
                (response) => {
                    this.categories = response.data;
                },
                (error: Response) => {

                }
            )
    }

    onUpdate() {

        this.updating = true;

        console.log('the product: ', this.product);
        const product = this.product;

        this.productService.returnStockProduct(product)
            .map(
                (productRes) => {
                    console.log('product response: ', productRes);
                    return productRes;
                }
            )
            .subscribe(
                (productRes) => {
                    console.log('the on save data', productRes);
                    this.updating = false;
                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    //console.log('must handle this error: ', error);
                    this.updating = false;
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }

}
