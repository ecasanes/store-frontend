import {Component} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

import {AuthService} from "./shared";
import {ConfirmLoginModalComponent} from "./components";
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    error: string = "";

    confirmLoginModalShown: boolean = false;

    constructor(
        private authService: AuthService,
        private modalService: NgbModal,
        public activeModal: NgbActiveModal,
        public router: Router
    ) {

        this.checkSession();

    }

    checkSession() {

        console.log('checking session ...');

        this.authService.showModal.subscribe(
            needsAuth => {
                if (needsAuth) {

                    if(this.confirmLoginModalShown){
                        return false;
                    }

                    this.confirmLoginModalShown = true;

                    console.log('Session has expired! Confirm login modal will be displayed');
                    this.activeModal.dismiss({message:"Session has expired!"});
                    this.openConfirmLoginModal();
                }
            },
            error => {
                console.log('error', error)
            }
        )
    }

    openConfirmLoginModal() {

        const modalRef = this.modalService.open(ConfirmLoginModalComponent, {
            keyboard: false,
            windowClass: 'animated bounceIn bordered',
            backdrop: 'static'
        });

        modalRef.result
            .then(
                (modalObject) => {

                    const state = modalObject.state;
                    this.confirmLoginModalShown = false;

                    switch(state){
                        case 'success':
                            break;
                        case 'logout':
                            this.router.navigateByUrl('/signin').then(()=>{});
                            break;
                    }

                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

}
