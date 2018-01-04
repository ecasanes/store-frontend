export class DeliveryItem {

    id?: number;
    product_variation_id: number;
    delivery_id: number;
    quantity: number;
    name: string;
    size: number;
    metrics: string;

    isValid(): boolean{

        if(this.product_variation_id == null){
            return false;
        }

        if(this.quantity == null){
            return false;
        }

        return true;

    }

}