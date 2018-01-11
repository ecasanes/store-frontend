import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {ModalService} from "../../../shared/services/helpers/modal.service";
import {AddSellerModalComponent} from "../../modals/add/add-seller-modal/add-seller-modal.component";

@Component({
    selector: 'app-sellers',
    templateUrl: './sellers.component.html',
    styleUrls: ['./sellers.component.css']
})
export class SellersComponent implements OnInit {

    sellers: User[] = [];

    constructor(
        private userService: UserService,
        private modalService: ModalService
    ) {
    }

    ngOnInit() {
        this.getAllSellers();
    }

    getAllSellers() {

        this.userService.getAllSellers()
            .subscribe(
                (response) => {
                    console.log('sellers: ', response.data);
                    this.sellers = response.data;
                },
                (error) => {
                    console.log('something went wrong while fetching sellers: ', error);
                }
            )

    }

    onCreate() {

        const modalConfig = {
            size: 'lg'
        };

        const modalRef = this.modalService.open(AddSellerModalComponent);

        modalRef.result
            .then(
                (results) => {
                    console.log('modal dismissed');
                    this.getAllSellers();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onDelete(userId: number) {

        this.userService.deleteUser(userId)
            .subscribe(
                (response) => {
                    this.getAllSellers();
                },
                (error) => {
                    console.log('something went wrong while deleteing user: ', error);
                }
            )

    }

}
