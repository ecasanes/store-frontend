import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    RoleService,
    UserService,
    BranchService,
    ErrorResponseService
} from "../../../../shared";

import {
    ErrorResponse,
    User,
    Role,
    Branch
} from '../../../../classes';


@Component({
    selector: 'app-add-staff-modal',
    templateUrl: './add-staff-modal.component.html',
    styleUrls: ['./add-staff-modal.component.css']
})
export class AddStaffModalComponent implements OnInit {

    title: string = 'ADD STAFF';

    instruction: string = 'Fill up the required fields to add a staff';

    staff: User = new User();

    roles: Role[];

    branches: Branch[];

    errorResponse: ErrorResponse = new ErrorResponse();

    currentPage: number = 1;
    query: string = "";
    limit: number;

    voidPrivilege: any = [
        {value: 0, label: 'No', isChecked: true},
        {value: 1, label: 'Yes', isChecked: false},
    ];

    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private branchService: BranchService,
        private userService: UserService,
        private errorResponseService: ErrorResponseService,
        private roleService: RoleService) {
            this.checkSession();
            this.getStaffRoles();
            this.getAllBranches();
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

    getStaffRoles() {

        const currentPage = this.currentPage;
        const query = this.query;
        const limit = this.limit;

        this.roleService.getStaffRoles(currentPage, query, limit)
            .subscribe(
                (response) => {
                    this.roles = response.data;
                },
                (error: Response) => {

                }
            )
    }

    getAllBranches() {
        this.branchService.getBranches()
            .subscribe(
            (response) => {
                this.branches = response.data;
            },
            (error: Response) => {

            }
        )
    }

    onSave() {

        console.log('the staff: ', this.staff);

        let user = this.staff;

        user.role = 'staff';

        console.log("the user", user);

        this.userService.createUser(user)
            .map(
                (response) => {

                    console.log('create staff response: ', response);

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
