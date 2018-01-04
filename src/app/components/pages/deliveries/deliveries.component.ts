import {Component, OnDestroy, OnInit} from "@angular/core";
import {Response} from "@angular/http";

import {
    Constants,
    AlertService,
    ModalService,
    DeliveryService,
    ErrorResponseService
} from '../../../shared';

import {
    Delivery,
    NewDelivery,
    DeliveryItem,
    ErrorResponse
} from '../../../classes';

import {
    AddDeliveryModalComponent,
    EditDeliveryModalComponent,
    ReturnDeliveryModalComponent
} from '../../modals';

import {
    HttpService,
    ExportService,
    SearchService
} from "../../../shared/services";

@Component({
    selector: 'app-deliveries',
    templateUrl: './deliveries.component.html',
    styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit, OnDestroy {

    currentDeliveryItems: DeliveryItem[] = [];
    currentDelivery: Delivery = new Delivery();
    currentDeliveryItemsTotal: number = 0;

    confirmedStatus: string = Constants.getConfirmedStatus;

    deliveries: Delivery[] = [];

    deliveryMaxLength: number;
    deliveryCurrentLength: number;
    deliveryLimit: number;
    deliveryCurrentPage: number = 1;

    panelTitle: string = "Deliveries";
    panelDescription: string = "List of all Deliveries";

    errorResponse: ErrorResponse = new ErrorResponse();

    loadingData: boolean = false;

    spreadSheetUrl: string = '';

    constructor(private deliveryService: DeliveryService,
                private modalService: ModalService,
                private errorService: ErrorResponseService,
                private alertService: AlertService,
                private searchService: SearchService,
                private exportService: ExportService) {
        this.getDeliveries();
    }


    ngOnInit() {

        this.searchService.isOn.emit(false);

    }

    ngOnDestroy() {

    }

    getDeliveries() {

        this.loadingData = true;
        this.deliveries = [];

        this.deliveryService.getDeliveries(this.deliveryCurrentPage)
            .subscribe(
                (response) => {
                    this.deliveries = response.data;
                    this.deliveryLimit = response.limit;
                    this.deliveryCurrentLength = response.data.length;
                    this.deliveryMaxLength = response.length;
                    this.loadingData = false;
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }

            )
    }

    getDeliveryItems(deliveryId: number) {
        this.deliveryService.getDeliveryItems(deliveryId)
            .subscribe(
                (response) => {
                    this.currentDeliveryItems = response.data;
                    this.computeDeliveryItemsTotal(this.currentDeliveryItems);
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    viewDeliveryItems(delivery: Delivery) {

        if (this.currentDelivery.id == delivery.id) {
            this.currentDelivery = new Delivery();
            this.currentDeliveryItems = [];
            return false;
        }

        console.log('view delivery');

        this.currentDelivery = delivery;
        this.getDeliveryItems(delivery.id);
    }

    computeDeliveryItemsTotal(deliveryItems: DeliveryItem[]) {

        let total = 0;

        deliveryItems.forEach(function (item) {

            total += parseFloat("" + item.quantity);

        });

        this.currentDeliveryItemsTotal = total;

    }

    hasPendingDelivery(delivery: Delivery) {

        if (delivery.status == Constants.getPendingStatus) {
            return true;
        }

        return false;
    }

    ifConfirmedDelivery(delivery: Delivery) {
        if(delivery.status == this.confirmedStatus) {

            return true;
        }

        return false;
    }

    onUpdateStatus(delivery: Delivery) {

        if (delivery.status != 'pending') {
            return false;
        }

        this.alertService.confirm("Confirm Delivery?")
            .then(() => {
                this.confirmDelivery(delivery)
            })
            .catch(() => {
            });


    }

    confirmDelivery(delivery: Delivery) {

        const deliveryId = delivery.id;

        this.deliveryService.confirmDelivery(deliveryId)
            .subscribe(
                (response) => {
                    console.log('confirm delivery response: ', response);
                    this.alertService.notifySuccess('Delivery successfully confirmed');
                    this.getDeliveries();
                },
                (error: Response) => {
                    this.errorResponse = this.errorService.handleError(error);
                }
            )

    }

    selectPage(page: number) {
        this.deliveryCurrentPage = page;
        this.getDeliveries();
    }

    openAddDeliveryModal() {

        const modalRef = this.modalService.open(AddDeliveryModalComponent);

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    this.getDeliveries();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openEditDeliveryModal(delivery: NewDelivery) {

        const modalRef = this.modalService.open(EditDeliveryModalComponent);

        modalRef.componentInstance.delivery = delivery;
        modalRef.result
            .then(
                (results) => {
                    this.getDeliveries();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openReturnDeliveryModal(delivery: Delivery = null) {

        const modalRef = this.modalService.open(ReturnDeliveryModalComponent);

        if(delivery) {
            modalRef.componentInstance.returnSpecificDelivery = true;
            modalRef.componentInstance.branchId = delivery.branch_id;
            modalRef.componentInstance.branchName = delivery.branch_name;
            modalRef.componentInstance.branchType = delivery.branch_type;

            this.deliveryService.getDeliveryItems(delivery.id).
                subscribe(
                    (response) => {

                        let deliveryItems = response.data;

                        deliveryItems.forEach(function(item) {
                           item.quantity = 0;

                        });
                        modalRef.componentInstance.deliveryItems = deliveryItems;
                    },
                    (error: Response) => {
                        this.errorResponse = this.errorService.handleError(error);
                    }
                )
        }

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    this.getDeliveries();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    onEdit(delivery: Delivery) {

        let newDelivery = new NewDelivery();
        newDelivery.id = delivery.id;
        newDelivery.branch_id = delivery.branch_id;

        this.openEditDeliveryModal(newDelivery);

    }

    onVoid(delivery: Delivery) {

        this.alertService.confirmDelete("Void this delivery?", null, "Yes")
            .then(() => {
                this.voidDelivery(delivery)
            })
            .catch()

    }

    onReturnDeliveryItems(delivery: Delivery) {

        this.openReturnDeliveryModal(delivery)

    }

    onExportDeliveryItems(delivery: Delivery) {
        this.loadingData = true;
        this.getDeliveryItemsData(delivery);
    }

    getDeliveryItemsData(delivery) {
        this.deliveryService.getDeliveryItems(delivery.id)
            .subscribe(
                (response) => {
                    this.currentDeliveryItems = response.data;
                    this.computeDeliveryItemsTotal(this.currentDeliveryItems);
                    console.log('The delivery itself', delivery);

                    let deliveryDetails: object = {
                        remarks: delivery.remarks,
                        status: delivery.status,
                        branch: delivery.branch_name,
                        date: delivery.delivery_date
                    };

                    this.exportDeliveryItems(this.currentDeliveryItems, this.currentDeliveryItemsTotal, deliveryDetails);
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    exportDeliveryItems(deliveryItems, totalDeliveryItems, deliveryDetails) {

        if(deliveryDetails.status == 'confirmed') {
            console.log('This delivery has been ' + deliveryDetails.status);
        }

        if(deliveryDetails.status == 'return') {
            console.log('This delivery was ' + deliveryDetails.status+'ed');
        }

        if(deliveryDetails.status == 'pending') {
            console.log('This delivery is still ' + deliveryDetails.status);
        }

        console.log('Here are your delivery items', deliveryItems);
        console.log('Here is the total number of items for your delivery', totalDeliveryItems);

        this.exportService.exportDeliveriesData(deliveryItems, totalDeliveryItems, deliveryDetails)
            .subscribe(
                (response) => {
                    this.loadingData = false;
                    this.spreadSheetUrl = response.data;

                    window.location.href = this.spreadSheetUrl;

                    console.log('Download link', this.spreadSheetUrl);

                },
                (error: Response) => {
                    console.log('An error occurred while exporting this delivery', error);
                }
            )

    }

    voidDelivery(delivery: Delivery){

        const deliveryId = delivery.id;

        this.deliveryService.voidDelivery(deliveryId)
            .subscribe(
                (response) => {
                    console.log('confirm delivery response: ', response);
                    this.alertService.notifySuccess('Delivery successfully voided');
                    this.getDeliveries();
                },
                (error: Response) => {
                    this.errorResponse = this.errorService.handleError(error);
                }
            )
    }

}
