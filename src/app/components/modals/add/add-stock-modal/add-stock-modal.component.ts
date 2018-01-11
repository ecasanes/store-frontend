import {Component, Input, OnInit} from '@angular/core';
import {ProductVariation} from "../../../../classes/product-variation.class";
import {ErrorResponse} from "../../../../classes/error-response.class";
import {ErrorResponseService} from "../../../../shared/services/helpers/error-response.service";
import {ProductService} from "../../../../shared/services/api/product.service";
import {AuthService} from "../../../../shared/services/api/auth.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Product} from "../../../../classes/product.class";

@Component({
    selector: 'app-add-stock-modal',
    templateUrl: './add-stock-modal.component.html',
    styleUrls: ['./add-stock-modal.component.css']
})
export class AddStockModalComponent implements OnInit {

    @Input() products: ProductVariation[] = [];

    storeId: number = null;
    product: Product = new Product();


    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private productService: ProductService,
                private errorResponseService: ErrorResponseService,
    ) {
        this.checkSession();
    }

    ngOnInit() {
        this.storeId = this.authService.getStoreId();
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

    onSave() {

        this.productService.restockProduct(this.storeId, this.product)
            .subscribe(
                (productRes) => {
                    console.log('the on save data', productRes);
                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    //console.log('must handle this error: ', error);
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }

}
