import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {EditPasswordModalComponent} from "../../modals/edit/edit-password-modal/edit-password-modal.component";
import {ModalService} from "../../../shared/services/helpers/modal.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    currentUser: User = new User();

    constructor(
        private userService: UserService,
        private modalService: ModalService
    ) {
    }

    ngOnInit() {
        this.getProfile();
    }

    getProfile() {

        this.userService.getCurrentUserProfile()
            .subscribe(
                (response) => {
                    this.currentUser = response.data;
                },
                (error) => {
                    console.log('something went wrong while fetching current user profile', error);
                }
            )

    }

    onChangePassword(user: User) {

        const modalRef = this.modalService.open(EditPasswordModalComponent);
        modalRef.componentInstance.currentUser = this.currentUser;

        modalRef.result
            .then(
                (results) => {
                    console.log('modal dismissed');
                    this.getProfile();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

}
