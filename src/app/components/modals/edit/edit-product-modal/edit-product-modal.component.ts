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

    categories: ProductCategory[];
    productImage: File;
    productImageName: string = "";

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private productService: ProductService,
                private errorResponseService: ErrorResponseService) {
        this.checkSession();
        this.getCategories();
    }

    ngOnInit() {
        this.setProductImageName(this.product);
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

        console.log('the product: ', this.product);
        const product = this.product;

        this.productService.updateProduct(product)
            .map(
                (productRes) => {
                    console.log('product response: ', productRes);

                    const productId = productRes.product_id;
                    this.uploadProductImage(productId, this.productImage);

                    return productRes;
                }
            )
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

    uploadProductImage(productId: number, productImage: File) {

        if(typeof productImage == 'undefined'){
            return false;
        }

        this.productService.uploadProductImage(productId, productImage)
            .subscribe(
                (data) => console.log('success upload: ', data),
                (error) => console.log('error upload: ', error)
            );

    }

    onSelectedFile(fileEvent) {

        this.productImage = fileEvent.srcElement.files[0];

        if(typeof this.productImage == 'undefined'){
            return false;
        }

        this.productImageName = this.productImage.name;

        console.log('Product Image: ', this.productImage);
    }

    setProductImageName(product: Product) {

        this.productImageName = product.image_url;

    }

}
