export class ProductVariation {

    constructor() {
        this.size = null;
        this.name = "";
        this.metrics = 'pc';
        this.quantity = null;
        this.cost_price = null;
        this.selling_price = null;
        this.product_id = null;
        this.product_variation_id = null;
    }

    id?: number;
    product_variation_id: number;
    name: string;
    size: number;
    metrics: string;
    quantity: number;
    cost_price: number;
    selling_price: number;
    shipping_price: number;
    franchisee_price: number;
    status: string;
    product_id: number;

    image_url: string;

    category: string;
    condition: string;

    branch_quantity: number;
    company_quantity: number;
    last_delivery_quantity: number;
    branch_total_delivery_quantity: number;
    branch_delivery_percentage: number;

    isSelected: boolean = false;

    subtotal:number = 0;
    returned_quantity:number = 0;

    seller_firstname: string;
    seller_middlename: string;
    seller_lastname: string;

    isValid(): boolean {

        if (this.size == null) {
            return false;
        }

        if (this.quantity == null) {
            return false;
        }

        if (this.cost_price == null) {
            return false;
        }

        if (this.selling_price == null) {
            return false;
        }

        return true;

    }

    setFromJson(jsonData: any) {


    }

    computeSubtotal(){
        this.subtotal = this.quantity*this.selling_price;
        return this.subtotal;
    }

    getQuantityMinusReturned() {
        return this.quantity - this.returned_quantity;
    }

    addQuantity(){

        if(parseFloat(""+this.quantity) == parseFloat(""+this.branch_quantity)){
            return false;
        }

        console.log('add quantity');

        this.quantity++;
        this.computeSubtotal();

        return true;
    }

}