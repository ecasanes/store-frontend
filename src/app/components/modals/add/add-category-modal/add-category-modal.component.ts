import { Component, OnInit, Input } from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    CategoryService,
    ErrorResponseService,
    AuthService
} from "../../../../shared";

import {
    ErrorResponse,
    ProductCategory,
    ProductVariation
} from '../../../../classes';

@Component({
    selector: 'app-add-category-modal',
    templateUrl: './add-category-modal.component.html',
    styleUrls: ['./add-category-modal.component.css']
})
export class AddCategoryModalComponent implements OnInit {

    title: string = 'ADD CATEGORY';

    instruction: string = 'Fill up the required fields below to add a category';

    [x: string]: any;

    @Input() name;

    categories: ProductCategory[];

    category: ProductCategory = new ProductCategory();

    errorResponse: ErrorResponse = new ErrorResponse();
    

    constructor(public activeModal: NgbActiveModal, private categoryService: CategoryService,
         private errorResponseService: ErrorResponseService,  private authService: AuthService){

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
    
    generateProductCode() {
     
    }

    onSave() {

        console.log('the category: ', this.category);

        const category = this.category;

        this.categoryService.addCategory(category)
            .map(
                (productRes) => {

                    console.log('product response: ', productRes);

                    const categoryId = productRes.id;

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

    onAddVariationRow(variation: ProductVariation){
        console.log('variation: ', variation);
        this.product.addNewVariation();
        console.log('variations: ', this.product.variations);
    }

    onRemoveVariationRow(variation: ProductVariation){
        console.log('variation: ', variation);
    }

}
