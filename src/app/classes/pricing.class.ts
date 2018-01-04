export class Pricing {

    constructor() {
        this.name = '';
        this.code = '';
        this.description = '';
        this.type = '';
        this.discount = '';
        this.discount_type = '';
        this.apply_to = '';
        this.quantity;
        this.amount ;
    }

    id?: number;
    name: string;
    code: string;
    description: string;
    status?: string;
    type: string;
    discount: string;
    discount_type: string;
    apply_to: string;
    quantity?: number;
    amount?: number;
    size;
    metrics: string;
    product_id;
    product_variation_id;
    product_name: string;
}