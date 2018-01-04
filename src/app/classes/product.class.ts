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
    franchisee_price: number;
    quantity: number;
    company_quantity: number;
    total_quantity: number;
    total_branch_quantity: number;
    product_variation_id: number;
    product_category_id: number;
    size: number;

    remarks?: string;

    getTotalQuantity(){

        if(this.total_quantity == null){
            return 0;
        }

        return this.total_quantity;

    }
}