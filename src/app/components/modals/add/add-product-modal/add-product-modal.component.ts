import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Slug} from "ng2-slugify";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

import {
    ProductService,
    ErrorResponseService,
    AuthService,
    Constants
} from "../../../../shared";

import {
    NewProduct,
    ProductCategory,
    ProductVariation,
    ErrorResponse
} from '../../../../classes';


@Component({
    selector: 'app-add-product-modal',
    templateUrl: './add-product-modal.component.html',
    styleUrls: ['./add-product-modal.component.css']
})
export class AddProductModalComponent implements OnInit {

    @Input() name;

    categories: ProductCategory[];
    category: ProductCategory;
    product: NewProduct = new NewProduct();
    productImage: File;
    productImageName: string = "";
    productImageUrl: SafeUrl; // "https://placeimg.com/640/480/tech/grayscale";
    metrics: any = Constants.getMetrics;

    slugService: Slug = new Slug('default');

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private productService: ProductService,
        private errorResponseService: ErrorResponseService,
        private sanitizer: DomSanitizer
    ) {
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

    onSave() {

        console.log('the product: ', this.product);
        const product = this.product;

        this.productService.addProduct(product)
            .map(
                (productRes) => {
                    console.log('product response: ', productRes);

                    const productId = productRes.id;
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

    uploadProductImage(productId:number, productImage: File) {

        this.productService.uploadProductImage(productId, productImage)
            .subscribe(
                (data) => console.log('success upload: ', data),
                (error) => console.log('error upload: ', error)
            );

    }

    onSelectedFile(fileEvent) {

        console.log('fileEvent: ', fileEvent);

        this.productImage = fileEvent.srcElement.files[0];

        if(typeof this.productImage == 'undefined'){
            return false;
        }

        this.productImageUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.productImage)));
        this.productImageName = this.productImage.name;

        console.log('Product Image: ', this.productImage);
    }

    generateProductCode() {
        // commented as product might have bar code
        //this.product.code = this.slugService.slugify(this.product.name);
    }

    onAddVariationRow(variation: ProductVariation){
        this.product.addNewVariation();
    }

    onRemoveVariationRow(index: number){
        this.product.removeVariationByIndex(index);
    }

}
