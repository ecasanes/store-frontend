import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    UserService,
    ErrorResponseService,
} from "../../../../shared";

import {
    User,
    ErrorResponse
} from '../../../../classes';

@Component({
    selector: 'app-add-managers-modal',
    templateUrl: './add-manager-modal.component.html',
    styleUrls: ['./add-manager-modal.component.css']
})
export class AddManagersModalComponent implements OnInit {

    title: string = 'ADD MANAGER';

    description: string = 'Fill up the required fields below to register a manager';

    permissionsList: any = [
        { code: 'inventory', label: 'Inventory', isChecked: true},
        { code: 'sales', label: 'Sales', isChecked: false}
    ];

    permissions: any = [{}];

    authService: any;
    manager: User = new User();
    errorResponse: ErrorResponse = new ErrorResponse();
    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService,
        private errorResponseService: ErrorResponseService,
    ) {

    }

    ngOnInit() {
        // console.log('===== the permissions',this.permissions);
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

        let user = this.manager;

        user.role = 'company_staff';

        user.permissions = [];

        this.permissionsList.forEach(function (permission) {
                if(permission.isChecked) {
                    user.permissions.push(permission.code);
                }
            }
        );

        console.log("the manager", user);

        this.userService.createUser(user)
            .map(
                (response) => {

                    console.log('create manager response: ', response);

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

    printPermissions() {
        console.log("these are the selected permissions", this.permissions);
    }

}
