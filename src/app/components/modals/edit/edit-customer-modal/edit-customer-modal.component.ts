import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    UserService,
    BranchService,
    ErrorResponseService
} from "../../../../shared";

import {
    User,
    Branch,
    ErrorResponse
} from '../../../../classes';

@Component({
    selector: 'app-edit-customer-modal',
    templateUrl: './edit-customer-modal.component.html',
    styleUrls: ['./edit-customer-modal.component.css']
})
export class EditCustomerModalComponent implements OnInit {

    title: string = 'EDIT CUSTOMER';

    instruction: string = 'Fill up the fields that need to be updated';

    @Input() customer: User = new User();

    errorResponse: ErrorResponse = new ErrorResponse();

    branchList: Branch[];

    constructor(
       public activeModal: NgbActiveModal,
       private authService: AuthService,
       private userService: UserService,
       private errorResponseService: ErrorResponseService,
       private branchService: BranchService
    ) {
        this.checkSession()
    }
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

    onUpdate() {

        let customer = this.customer;

        customer.branch_id_registered = customer.branch_id;

        console.log('the customer: ', customer);

        this.userService.updateUser(customer.id, customer)
            .map(
                (userResponse) => {
                    console.log('user response: ', userResponse);

                    const userId = userResponse.id;

                    return userResponse;
                }
            )
            .subscribe(
                (userResponse) => {
                    console.log('the on save data', userResponse);
                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    //console.log('must handle this error: ', error);
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }
}

