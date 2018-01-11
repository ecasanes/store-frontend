import {Component, OnInit} from '@angular/core';
import {User} from "../../../../classes/user.class";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ErrorResponseService} from "../../../../shared/services/helpers/error-response.service";
import {UserService} from "../../../../shared/services/api/user.service";
import {ErrorResponse} from "../../../../classes/error-response.class";

@Component({
    selector: 'app-add-seller-modal',
    templateUrl: './add-seller-modal.component.html',
    styleUrls: ['./add-seller-modal.component.css']
})
export class AddSellerModalComponent implements OnInit {

    user: User = new User();
    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        public activeModal: NgbActiveModal,
        private errorResponseService: ErrorResponseService,
        private userService: UserService
    ) {
        this.user.role = 'seller';
    }

    ngOnInit() {
    }

    onAdd() {
        this.userService.createUser(this.user)
            .subscribe(
                (response) => {
                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    this.errorResponse = this.errorResponseService.handleError(error);
                }
            )
    }

}
