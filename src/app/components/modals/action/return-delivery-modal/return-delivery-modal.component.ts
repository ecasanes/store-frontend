import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    ProductService,
    BranchService,
    DeliveryService,
    ErrorResponseService
} from "../../../../shared";

import {
    ErrorResponse,
    Branch,
    ProductVariation,
    NewDelivery
} from '../../../../classes';
import {Constants} from "../../../../shared/constants";

@Component({
    selector: 'app-return-delivery-modal',
    templateUrl: './return-delivery-modal.component.html',
    styleUrls: ['./return-delivery-modal.component.css']
})
export class ReturnDeliveryModalComponent implements OnInit {

    @Input() name;
    @Input() returnSpecificDelivery;
    @Input() deliveryItems;
    @Input() branchId;
    @Input() branchName;
    @Input() branchType;

    newDelivery: NewDelivery = new NewDelivery();

    productVariations: ProductVariation[] = [];

    branches: Branch[] = [];
    isFranchisee: boolean = false;

    errorResponse: ErrorResponse = new ErrorResponse();

    updating:boolean = false;

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private productService: ProductService,
                private branchService: BranchService,
                private deliveryService: DeliveryService,
                private errorResponseService: ErrorResponseService) {
        this.checkSession();
    }


    ngOnInit() {

        const branchType = this.branchType;

        if(branchType == Constants.franchiseeFlag){
            this.isFranchisee = true;
        }
    }

    onAddDeliveryItem(){
        this.newDelivery.addNewDeliveryItem();
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

    onSave() {

        this.updating = true;
        console.log('this.updating', this.updating);

        let delivery = this.newDelivery;

        if(this.returnSpecificDelivery) {

            delivery.branch_id = this.branchId;
            delivery.deliveries = this.deliveryItems;

        }

        this.deliveryService.returnDelivery(delivery)
            .map(
                (productRes) => {
                    console.log('product response: ', productRes);
                    return productRes;
                }
            )
            .subscribe(
                (productRes) => {
                    console.log('the on save data', productRes);
                    this.updating = false;
                    this.activeModal.close();
                },
                (error) => {
                    console.log('must handle this error: ', error);
                    this.updating = false;
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }

}
