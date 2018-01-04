import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    BranchService,
    AuthService,
    ErrorResponseService
} from "../../../../shared";

import {
    Branch,
    ErrorResponse
} from '../../../../classes';


@Component({
    selector: 'app-add-store-modal',
    templateUrl: './add-store-modal.component.html',
    styleUrls: ['./add-store-modal.component.css']
})
export class AddStoreModalComponent implements OnInit {

    branch: Branch = new Branch();
    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private branchService: BranchService,
        private errorResponseService: ErrorResponseService
    ) {
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

    onSave(){

        this.branchService.addBranch(this.branch)
            .map(
                (productRes) => {
                    console.log('product response: ', productRes);
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



}
