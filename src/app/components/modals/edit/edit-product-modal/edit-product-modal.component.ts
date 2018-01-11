import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    ProductService,
    ErrorResponseService
} from "../../../../shared";

import {
    ProductCategory,
    ErrorResponse,
    Product
} from '../../../../classes';

@Component({
    selector: 'app-edit-product-modal',
    templateUrl: './edit-product-modal.component.html',
    styleUrls: ['./edit-product-modal.component.css']
})
export class EditProductModalComponent implements OnInit {

    @Input() product: Product = new Product();
    @Input() isReadOnly: boolean = false;

    panelTitle: string = "Edit Product";

    categories: ProductCategory[];
    conditions: ProductCategory[];

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private productService: ProductService,
                private errorResponseService: ErrorResponseService) {
        this.checkSession();
        this.getCategories();
        this.getConditions();

        if(this.isReadOnly){
            this.panelTitle = "View Product";
        }

    }

    ngOnInit() {
        console.log("PRODUCT: ", this.product);
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

    getConditions() {
        this.productService.getConditionsFromModal()
            .subscribe(
                (response) => {
                    this.conditions = response.data;
                },
                (error: Response) => {

                }
            )
    }

    onUpdate() {

        console.log('the product: ', this.product);
        const product = this.product;

        this.productService.updateProduct(product)
            .subscribe(
                (productRes) => {
                    console.log('the on save data', productRes);
                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }

}
