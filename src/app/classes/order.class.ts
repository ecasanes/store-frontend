import {Product} from "./product.class";
export class Order {

    products: Product[] = [];
    address: string;
    voucher: string;
    card_number: string;
    payment_mode_id: number;
    buyer_user_id: number;

    id:number;
    transaction_id: number;
    store_id:number;
    total:number;
    buyer_status:string;
    seller_status:string;
    order_id:number;
    items_string:string;

    created_at:string;
    updated_at:string;

    seller_name: string;
    buyer_name: string;

    tracking_no:string;

}