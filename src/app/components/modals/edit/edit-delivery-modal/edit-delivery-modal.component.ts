import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    ProductService,
    DeliveryService,
    ErrorResponseService,
    BranchService
} from "../../../../shared";

import {
    NewDelivery,
    ProductVariation,
    Branch,
    ErrorResponse
} from '../../../../classes';

@Component({
    selector: 'app-edit-delivery-modal',
    templateUrl: './edit-delivery-modal.component.html',
    styleUrls: ['./edit-delivery-modal.component.css']
})
export class EditDeliveryModalComponent implements OnInit {

    @Input() delivery: NewDelivery;

    productVariations: ProductVariation[] = [];
    branches: Branch[] = [];

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private productService: ProductService,
                private branchService: BranchService,
                private deliveryService: DeliveryService,
                private errorResponseService: ErrorResponseService
    ) {
        this.checkSession();
        this.getBranches();
        this.getAllProductVariations();
    }


    ngOnInit() {
        this.getDeliveryItems(this.delivery);
    }

    onAddDeliveryItem() {
        this.delivery.addNewDeliveryItem();
    }

    onRemoveDeliveryItem(index) {

        this.delivery.deliveries.splice(index, 1);
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

    getDeliveryItems(delivery: NewDelivery){

        const deliveryId = delivery.id;

        console.log('deliveryID: ', delivery);

        this.deliveryService.getDeliveryItems(deliveryId)
            .subscribe(
                (response) => {
                    console.log('delivery items: ', response.data);
                    this.delivery.setNewDeliveries(response.data)
                },
                (error: Response) =>
                    console.log(error)
            );

    }

    getAllProductVariations() {

        this.productService.getAllProductVariations()
            .subscribe(
                (response) => {
                    this.productVariations = response.data;
                },
                (error: Response) =>
                    console.log(error)
            );

    };

    getBranches() {
        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branches = response.data;
                },
                (error: Response) =>
                    console.log(error)
            );
    }

    onSave() {

        const delivery = this.delivery;
        this.deliveryService.updateDelivery(delivery)
            .map(
                (productRes) => {
                    console.log('product response: ', productRes);
                    return productRes;
                }
            )
            .subscribe(
                (productRes) => {
                    console.log('the on save data', productRes);
                    this.activeModal.close();
                },
                (error) => {
                    console.log('must handle this error: ', error);
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }

    test(item: ProductVariation) {

        /* const position = this.productVariations.findIndex(
         (variation: ProductVariation) => {
         return variation.id == item.id;
         }
         );

         this.productVariations.splice(position, 1);*/
    }

}
