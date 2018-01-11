import {Injectable} from "@angular/core";
import "rxjs/Rx";
import {SweetAlertService} from 'ngx-sweetalert2';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AlertService {

    constructor(private swal: SweetAlertService, private toastr: ToastrService) {

    }

    input(title: string, description: string = "") {

        return this.swal.info({
            title: title,
            text: description,
            input:'number',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: "Confirm"
        });

    }

    confirm(title: string, description: string = "", buttonText: string = "Yes") {

        return this.swal.warning({
            title: title,
            text: description,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: buttonText
        });

    }

    confirmSuccess(title: string = "Confirm?", description: string = "", confirmButtonText: string = "OK, delete it!") {

        return this.swal.info({
            title: title,
            text: description,
            showCancelButton: false,
            confirmButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            confirmButtonText: confirmButtonText,
        });

    }

    confirmDelete(title: string = "Delete?", description: string = "You won't be able to revert this!", confirmButtonText: string = "Yes, delete it!") {

        if (description == null) {
            description = "You won't be able to revert this!";
        }

        return this.swal.warning({
            title: title,
            text: description,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: confirmButtonText,
        });

    }

    error(title: string, description: string) {
        return this.swal.error({
            title: title,
            text: description,
            showCancelButton: false,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: "Okay"
        });
    }

    notify(message: string, title: string, type: string) {

        switch(type){
            case 'success':
                this.notifySuccess(message, title);
                break;
            case 'info':
                this.notifyInfo(message, title);
                break;
            case 'warning':
                this.notifyWarning(message, title);
                break;
            case 'danger':
                this.notifyDanger(message, title);
                break;
            default:
                this.notifyInfo(message, title);
        }
    }

    notifySuccess(message: string, title: string = "SUCCESS") {
        this.toastr.success(message, title);
    }

    notifyInfo(message: string, title: string = "NOTIFICATION") {
        this.toastr.info(message, title);
    }

    notifyWarning(message: string, title: string = "WARNING") {
        this.toastr.warning(message, title);
    }

    notifyDanger(message: string, title: string = "DANGER") {
        this.toastr.error(message, title);
    }

}