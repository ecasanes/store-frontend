import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    CategoryService,
    ErrorResponseService
} from "../../../../shared";

import {
    ProductCategory,
    ErrorResponse
} from '../../../../classes';

@Component({
    selector: 'app-edit-category-modal',
    templateUrl: './edit-category-modal.component.html',
    styleUrls: ['./edit-category-modal.component.css']
})

export class EditCategoryModalComponent implements OnInit {

    title: string = 'EDIT CATEGORY';

    instruction: string = 'Fill up the fields that need to be updated';

    @Input() category: ProductCategory = new ProductCategory();

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private categoryService: CategoryService,
        private errorResponseService: ErrorResponseService
    ) {
        this.checkSession();
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

                    this.authService.confirm.emit(true);
                }

            },
            error => {

                console.log('error', error)
            }
        )
    }

    onUpdate() {

        console.log('the category: ', this.category);

        const category = this.category;

        this.categoryService.updateCategory(category)
            .map(
                (response) => {

                    console.log('category response: ', response);

                    return response;
                }
            )
            .subscribe(
                (response) => {

                    console.log('the on save data', response);

                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    //console.log('must handle this error: ', error);
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );
    }
}