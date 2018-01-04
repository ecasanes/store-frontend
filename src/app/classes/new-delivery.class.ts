
import {DeliveryItem} from "./delivery-item.class";
// import {AlertService} from "../shared/services/helpers/alert.service";
export class NewDelivery {

    constructor(){
        this.branch_id = null;
        this.deliveries.push(new DeliveryItem());
        this.remarks = "";
        this.invoice_no = "";
    }


    id?: number;
    branch_id: number;
    deliveries: Array<DeliveryItem> = [];
    remarks: string;
    invoice_no?: string;

    // alertService: AlertService;

    addNewDeliveryItem(){

        const deliveries = this.deliveries;
        const length = deliveries.length;
        const last = deliveries[length-1];

        if(last.isValid()){
            deliveries.push(new DeliveryItem());
        }

    }

    // TODO: add alert when removing the last delivery item
    removeDeliveryItem(index) {

        let deliveries = this.deliveries;

        // let message = 'You must have at least 1 delivery item';
        // let title = 'Whoops!';
        // let type = 'warning';

        // if(deliveries.length == 1 && index == 0) {
        //
        //     this.alertService.notify(message, title, type);
        // }

        if(deliveries.length > 1) {
            deliveries.splice(index, 1);
        }

    }

    addAllDeliveryItems(products, isChecked) {

        let deliveries = this.deliveries;

        if(isChecked) {
            console.log('products list for delivery', products);
            deliveries.splice(0);
            products.forEach((product) => {
                deliveries.push(product);
            });
            console.log('updated deliveries', deliveries);
        }

        if(!isChecked) {
            products.forEach((product) => {
               deliveries.splice(product);
            });
            deliveries.push(new DeliveryItem());
        }

    }

    setNewDeliveries(deliveriesJson: any[]){

        this.deliveries = [];

        deliveriesJson.forEach((deliveryItem) => {
            const item = new DeliveryItem();
            item.product_variation_id = deliveryItem.product_variation_id;
            item.quantity = deliveryItem.quantity;
            this.deliveries.push(item);
        });

    }
}