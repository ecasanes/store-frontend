import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../classes/user.class";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ErrorResponseService} from "../../../../shared/services/helpers/error-response.service";
import {UserService} from "../../../../shared/services/api/user.service";
import {ErrorResponse} from "../../../../classes/error-response.class";

@Component({
    selector: 'app-add-buyer-modal',
    templateUrl: './add-buyer-modal.component.html',
    styleUrls: ['./add-buyer-modal.component.css']
})
export class AddBuyerModalComponent implements OnInit {

    user: User = new User();
    errorResponse: ErrorResponse = new ErrorResponse();

    @Input() action: string = "";

    constructor(public activeModal: NgbActiveModal,
                private errorResponseService: ErrorResponseService,
                private userService: UserService) {
        this.user.role = 'buyer';
    }

    ngOnInit() {
    }

    onAdd() {
        this.userService.createUserPublic(this.user)
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
