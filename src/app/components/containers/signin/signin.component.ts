import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

import {AuthService} from "../../../shared";
import {ErrorResponseService} from "../../../shared/services/helpers/error-response.service";
import {ErrorResponse} from "../../../classes/error-response.class";

declare var $: any;

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    error: string;
    errorResponse: ErrorResponse = new ErrorResponse();

    signingIn: boolean = false;

    constructor(private router: Router,
                private authService: AuthService,
                private errorResponseService: ErrorResponseService) {
    }

    ngOnInit() {

        document.body.classList.remove("dashboard");
        document.body.classList.add("login");

        const isLoggedIn = this.authService.isLoggedIn();

        if (isLoggedIn) {
            this.router.navigate([''])
                .then(function () {
                    console.log('redirected because already logged in');
                })
                .catch(function () {
                    console.log('something went wrong while entering sign in page')
                });
        }
    }

    signIn(form: NgForm) {

        this.signingIn = true;

        this.authService.signIn(form.value.email, form.value.password)
            .subscribe(
                tokenData => {

                    this.signingIn = false;
                    this.router.navigate(['/'])
                        .then(function () {
                            console.log('token data: ', tokenData)
                        })

                },
                error => {

                    this.signingIn = false;
                    const response = JSON.parse(error._body);
                    this.error = response.message;
                    this.errorResponse = this.errorResponseService.handleError(error);
                }
            )
    }

}
