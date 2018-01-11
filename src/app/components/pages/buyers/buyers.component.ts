import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {ModalService} from "../../../shared/services/helpers/modal.service";
import {AddSellerModalComponent} from "../../modals/add/add-seller-modal/add-seller-modal.component";
import {EditUserModalComponent} from "../../modals/edit/edit-user-modal/edit-user-modal.component";

@Component({
  selector: 'app-buyers',
  templateUrl: './buyers.component.html',
  styleUrls: ['./buyers.component.css']
})
export class BuyersComponent implements OnInit {

  buyers: User[] = [];

  constructor(
      private userService: UserService,
      private modalService: ModalService
  ) {
  }

  ngOnInit() {
    this.getAllBuyers();
  }

  getAllBuyers() {

    this.userService.getAllBuyers()
        .subscribe(
            (response) => {
              console.log('buyers: ', response.data);
              this.buyers = response.data;
            },
            (error) => {
              console.log('something went wrong while fetching buyers: ', error);
            }
        )

  }

  onView(user: User) {

    const modalRef = this.modalService.open(EditUserModalComponent);
    modalRef.componentInstance.user = user;

    modalRef.result
        .then(
            (results) => {
              console.log('modal dismissed');
              this.getAllBuyers();
            }
        )
        .catch(
            (error) => console.log('error', error)
        )

  }

}
