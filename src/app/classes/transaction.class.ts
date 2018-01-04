import {ProductVariation} from "./product-variation.class";
export class Transaction {


    constructor() {

        this.isViewed = false;
        this.items = [];
        this.staff_id = '';
    }

    id?: number;

    key:string;

    or_no: string;
    invoice_no: string;
    sub_type: string;
    branch_type: string;
    customer_id: any;
    transaction_type: string;
    transaction_type_name: string;

    transaction_type_id: number;
    staff_id: string = '';
    customer_user_id: number;
    customer_name: string;
    customer_firstname: string;
    customer_lastname: string;
    customer_phone: string;
    staff_firstname: string;
    staff_lastname: string;
    price_rule_id: number;
    price_rule_code: string;
    discount: number = 0;
    branch_name: string;

    user_id: number;
    branch_id: number;
    member_id: number;

    created_at: string;

    status: string;

    isViewed: boolean;
    items: ProductVariation[] = [];
    returns: ProductVariation[] = [];

    items_string: string;
    shortover_string: string;

    total:number = 0;
    franchisee_total: number = 0;

    setEmptyItems() {
        this.items = [];
    }

    setEmptyReturnItems() {
        this.returns = [];
    }

    isEmpty() {

        if (typeof this.items == null) {
            this.items = [];
        }

        if (this.items.length > 0) {
            return false;
        }

        return true;

    }

    addToCart(item: ProductVariation){

        if(item.isSelected){
            return false;
        }

        item.isSelected = true;

        item.quantity = 1;
        this.items.push(item);
        this.computeTotal();
    }

    addQuantity(item: ProductVariation){

        const itemAdded = item.addQuantity();

        if(!itemAdded){
            return false;
        }

        this.computeTotal();

        return true;

    }

    removeCartItem(index: number){

        this.items.splice(index,1);
        this.computeTotal();

    }

    computeTotal() {

        console.log('ITEMS: ', this.items);
        this.total = 0;

        this.items.forEach((item) => {
            this.total += parseFloat(''+item.selling_price)*parseFloat(''+item.quantity);
        });

        if(isNaN(this.total)){
            return 0;
        }

        this.total.toFixed(2);

        return this.total;
    }

    getTotalWithDiscount() {

        const total = this.computeTotal();

        const totalWithDiscount = total - this.discount;

        return totalWithDiscount;

    }

    setTransactionItems(itemsJsonArray: any[], returnsJsonArray: any[] = []) {

        this.setEmptyItems();

        itemsJsonArray.forEach((item: any) => {

            const productVariation = new ProductVariation();

            productVariation.name = item.name;
            productVariation.size = item.size;
            productVariation.metrics = item.metrics;
            productVariation.selling_price = item.selling_price;
            productVariation.product_variation_id = item.product_variation_id;
            productVariation.branch_quantity = item.branch_quantity;
            productVariation.quantity = item.quantity;
            productVariation.subtotal = item.subtotal;

            returnsJsonArray.forEach((returnedItem: any) => {

                if(returnedItem.product_variation_id == productVariation.product_variation_id){
                    productVariation.returned_quantity = returnedItem.quantity;
                }

            });

            this.items.push(productVariation);

        });

        this.computeTotal();

    }

    setReturnItems(itemsJsonArray: any[]) {

        this.setEmptyReturnItems();

        itemsJsonArray.forEach((item: any) => {

            const productVariation = new ProductVariation();

            productVariation.name = item.name;
            productVariation.size = item.size;
            productVariation.metrics = item.metrics;
            productVariation.selling_price = item.selling_price;
            productVariation.product_variation_id = item.product_variation_id;
            productVariation.branch_quantity = item.branch_quantity;
            productVariation.quantity = item.quantity;
            productVariation.subtotal = item.subtotal;



            this.returns.push(productVariation);

        })

    }

    calculateSubtotalMinusVat(vat: number) {
        console.log('calculate subtotal minus vat', this.total);
        return this.total - this.calculateVatPrice(vat);

    }

    calculateVatPrice(vat: number){

        console.log('TOTAL: ', this.total);
        console.log('VAT: ', vat);

        const newPrice = this.total*vat;

        return Number(newPrice.toFixed(2));

    }

    computeReturnsTotal() {

        let returnsTotal = 0;

        this.returns.forEach((item: ProductVariation) => {
            returnsTotal += parseFloat(''+item.subtotal);
        });

        return returnsTotal;

    }

    calculateTotal() {

        const total = this.total;

        if(total<=0){
            return 0;
        }

        return total;

    }
}