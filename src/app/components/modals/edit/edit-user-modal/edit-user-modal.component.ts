import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../classes/user.class";
import {ErrorResponseService} from "../../../../shared/services/helpers/error-response.service";
import {ProductService} from "../../../../shared/services/api/product.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../shared/services/api/auth.service";
import {ErrorResponse} from "../../../../classes/error-response.class";

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {

  @Input() user: User = new User();
  @Input() isReadOnly: boolean = false;

  panelTitle: string = "Edit User";

  errorResponse: ErrorResponse = new ErrorResponse();

  constructor(public activeModal: NgbActiveModal,
              private authService: AuthService,
              private productService: ProductService,
              private errorResponseService: ErrorResponseService) {
    this.checkSession();

    if(this.isReadOnly){
      this.panelTitle = "View User";
    }

  }

  ngOnInit() {
  }

  checkSession() {

    this.authService.dismissCurrentModal.subscribe(
        needsAuth => {

          if (needsAuth) {
            console.log('Session has expired! Modal will  be closed');
            setTimeout(() => {
              this.activeModal.dismiss({message: "Session has expired!"});
            }, 100);
            //this.authService.showModal.emit(true);
            this.authService.confirm.emit(true);
          }

        },
        error => {
          console.log('error', error)
        }
    )
  }

  onUpdate() {

    /*console.log('the product: ', this.product);
    const product = this.product;

    this.productService.updateProduct(product)
        .subscribe(
            (productRes) => {
              console.log('the on save data', productRes);
              this.activeModal.close({test: 'hello'});
            },
            (error) => {
              this.errorResponse = this.errorResponseService.handleError(error)
            }
        );*/

  }

}
