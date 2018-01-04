import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    UserService,
    RoleService,
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
    selector: 'app-edit-staff-modal',
    templateUrl: './edit-staff-modal.component.html',
    styleUrls: ['./edit-staff-modal.component.css']
})

export class EditStaffModalComponent implements OnInit {

    title: string = 'EDIT STAFF';

    instruction: string = 'Fill up the required fields that need to be updated';

    @Input() staff: User = new User();

    branches: Branch[];
    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private userService: UserService,
        private errorResponseService: ErrorResponseService,
        private roleService: RoleService,
        private branchService: BranchService
    ) {

        this.checkSession();

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
                    this.branches = response.data;
                },
                (error: Response) => {

                }
            )
    }

    onUpdate() {

        const staff = this.staff;
        console.log('the staff: ', staff);

        this.userService.updateUser(staff.id, staff)
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