import {Component, Input, OnInit} from '@angular/core';
import {ProductVariation} from "../../../../classes/product-variation.class";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Branch} from "../../../../classes/branch.class";
import {NewDelivery} from "../../../../classes/new-delivery.class";
import {DeliveryItem} from "../../../../classes/delivery-item.class";
import {DeliveryService} from "../../../../shared/services/api/delivery.service";
import {ErrorResponse} from "../../../../classes/error-response.class";
import {ErrorResponseService} from "../../../../shared/services/helpers/error-response.service";
import {Constants} from "../../../../shared/constants";

@Component({
  selector: 'app-return-delivered-single-item',
  templateUrl: './return-delivered-single-item.component.html',
  styleUrls: ['./return-delivered-single-item.component.css']
})
export class ReturnDeliveredSingleItemComponent implements OnInit {

  @Input() product: ProductVariation = new ProductVariation();
  @Input() branch: Branch = new Branch();

  quantity: number = 1;
  remarks: string = "";
  invoiceNo: string = "";

  errorResponse: ErrorResponse = new ErrorResponse();

  franchiseeFlag: string = Constants.franchiseeFlag;

  updating: boolean = false;

  constructor(
      public activeModal: NgbActiveModal,
      private deliveryService: DeliveryService,
      private errorResponseService: ErrorResponseService) {

    console.log('branch: ', this.branch);
  }

  ngOnInit() {

    console.log('branch: ', this.branch);

  }

  onDeliver() {

    this.updating = true;

    if(this.quantity<1){
      return false;
    }

    const newDelivery = new NewDelivery();
    const deliveryItem = new DeliveryItem();

    deliveryItem.quantity = this.quantity;
    deliveryItem.product_variation_id = this.product.id;

    console.log('delivery Item: ', deliveryItem);

    newDelivery.branch_id = this.branch.id;
    newDelivery.remarks = this.remarks;
    newDelivery.invoice_no = this.invoiceNo;
    newDelivery.deliveries = [];
    newDelivery.deliveries.push(deliveryItem);

    this.returnSingleItem(newDelivery);

  }

  returnSingleItem(delivery: NewDelivery) {

    this.updating = true;

    this.deliveryService.returnDelivery(delivery)
        .subscribe(
            (response) => {
              console.log('delivery response: ', response);
              this.updating = false;
              this.activeModal.close();
            },
            (error) => {
              console.log('error: ', error);
              this.updating = false;
              this.errorResponse = this.errorResponseService.handleError(error);
            }
        );

  }

}
