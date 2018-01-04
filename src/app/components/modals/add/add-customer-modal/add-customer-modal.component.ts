import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    ErrorResponseService,
    BranchService,
    UserService
} from "../../../../shared";

import {
    ErrorResponse,
    Branch,
    User
} from '../../../../classes';

@Component({
    selector: 'app-add-customer-modal',
    templateUrl: './add-customer-modal.component.html',
    styleUrls: ['./add-customer-modal.component.css']
})
export class AddCustomerModalComponent implements OnInit {

    title: string = 'ADD CUSTOMER';

    instruction: string = 'Fill up the required fields to add a customer';

    branchList: Branch[];
    authService: any;
    customer: User = new User();
    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService,
        private errorResponseService: ErrorResponseService,
        private branchService: BranchService
    ) { }

    ngOnInit() {
        this.getAllBranches();
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

    getAllBranches() {

        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branchList = response.data;
                },
                (error: Response) => {
                    console.log('An error occurred while retrieving all branch data', error);
                }
            )
    }

    onSave() {

        console.log('the customer: ', this.customer);

        let user = this.customer;

        user.branch_id_registered = user.branch_id;

        user.role = 'member';

        console.log("the customer", user);

        this.userService.createUser(user)
            .map(
                (response) => {

                    console.log('create customer response: ', response);

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
