import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    UserService,
    ErrorResponseService
} from "../../../../shared";

import {
    User,
    ErrorResponse
} from '../../../../classes'

@Component({
    selector: 'app-edit-manager-modal',
    templateUrl: './edit-manager-modal.component.html',
    styleUrls: ['./edit-manager-modal.component.css']
})

export class EditManagerModalComponent implements OnInit {

    title: string = 'EDIT MANAGER';

    instruction: string = 'Fill up the fields below that need to be updated';

    permissionsList: any = [
        { code: 'inventory', label: 'Inventory Management', isChecked: false},
        { code: 'sales', label: 'Sales Management', isChecked: false}
    ];

    @Input() manager: User = new User();
    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService,
        private authService: AuthService,
        private errorResponseService: ErrorResponseService
    ) {

    }

    ngOnInit() {
        this.checkSession();

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

    onUpdate() {

        const manager = this.manager;
        this.permissionsList = manager.permissions;
        manager.permissions = [];

        let numOfPermissions = this.checkIfNoPermissions(this.permissionsList);

        if(!numOfPermissions) {
            alert('You need to check at least 1 permission');
            manager.permissions = this.permissionsList;
            return;
        }

        this.permissionsList.forEach(function(permission) {
            if(permission.isChecked) {
                manager.permissions.push(permission.code);
            }
        })
        console.log('the manager: ', manager);
        this.userService.updateUser(manager.id, manager)
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
                    manager.permissions = this.permissionsList;
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }

    checkIfNoPermissions(permissions) {
        let count = 0;
        permissions.forEach(function (permission) {

            if(permission.isChecked) {
                count++;
            }
        });

        if(count == 0) {
            return false;
        }

        return true;

    }

}
