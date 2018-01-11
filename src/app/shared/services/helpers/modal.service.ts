import {Injectable} from "@angular/core";
import "rxjs/Rx";
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {AuthService} from '../api/auth.service';

@Injectable()
export class ModalService {

    constructor(private modal: NgbModal, private authService: AuthService) {

    }

    open(content:any, newOptions:NgbModalOptions = null, bypassAuth: boolean = false): NgbModalRef {

        const options: NgbModalOptions = {
            keyboard: false,
            windowClass: 'animated fadeInUp',
            backdrop: 'static'
            //size: 'lg'
        };

        if(newOptions == null){
            newOptions = options;
        }

        if(typeof newOptions.size != 'undefined'){
            options.size = newOptions.size;
        }

        if(bypassAuth){
            return this.modal.open(content, options);
        }

        if(this.authService.isLoggedIn()){
            return this.modal.open(content, options);
        }

        this.authService.showModal.emit(true);

        /*return {
            result: new Promise((resolve, reject) => {
                reject();
            })
        }*/


    }


}