import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../classes/user.class";
import {ErrorResponse} from "../../../../classes/error-response.class";
import {UserService} from "../../../../shared/services/api/user.service";
import {ErrorResponseService} from "../../../../shared/services/helpers/error-response.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-edit-password-modal',
    templateUrl: './edit-password-modal.component.html',
    styleUrls: ['./edit-password-modal.component.css']
})
export class EditPasswordModalComponent implements OnInit {

    @Input() currentUser: User = new User();

    errorResponse: ErrorResponse = new ErrorResponse();

    password: string = "";
    confirm_password: string = "";

    constructor(private userService: UserService,
                private errorResponseService: ErrorResponseService,
                public activeModal: NgbActiveModal) {
    }

    ngOnInit() {

    }

    onChangePassword() {

        this.userService.changePassword(this.currentUser).toPromise()
            .then(
                (response) => {
                    this.activeModal.dismiss();
                }
            ).catch(
            (error) => {
                this.errorResponse = this.errorResponseService.handleError(error);
            }
        )

    }

}
