import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {AuthService, ErrorResponseService} from "../../../../shared";
import {ErrorResponse} from '../../../../classes';

@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

    errorResponse: ErrorResponse = new ErrorResponse();
    loggingIn: boolean = false;

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private errorResponseService: ErrorResponseService,
                private router: Router) {
    }

    ngOnInit() {
    }

    onLogin(form: NgForm) {

        this.loggingIn = true;

        this.authService.signIn(form.value.email, form.value.password)
            .subscribe(
                tokenData => {
                    this.loggingIn = false;
                    this.router.navigateByUrl('/products');
                    this.activeModal.close({
                        state: 'success'
                    });
                },
                error => {
                    this.loggingIn = false;
                    this.errorResponse = this.errorResponseService.handleError(error);
                }
            )
    }

    onLogout() {
        this.activeModal.close({
            state: 'logout'
        });
        //window.location.reload();
        //this.router.navigateByUrl('/signin').then(()=>{});
    }

}
