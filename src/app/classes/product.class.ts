export class Product {

    id?: number;
    name: string;
    code: string;
    description: string;
    image_url:string;
    status:string;
    category: string;
    metrics: string;
    cost_price: number;
    selling_price: number;
    shipping_price: number;
    franchisee_price: number;
    quantity: number;
    company_quantity: number;
    total_quantity: number;
    total_branch_quantity: number;
    product_variation_id: number;
    product_category_id: number;
    product_condition_id: number;
    size: number;

    in_wishlist: number;
    in_cart: number;
    cart_quantity: number;
    store_id: number;

    remarks?: string;

    getTotalQuantity(){

        if(this.total_quantity == null){
            return 0;
        }

        return this.total_quantity;

    }

    getTotalPrice(){

        const total = (this.cart_quantity*this.selling_price)+(this.cart_quantity*this.shipping_price);

        return total;

    }
}