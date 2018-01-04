export class Delivery {

    constructor(){
        this.id = null;
        this.status = "";
        this.delivery_date = "";
        this.branch_id = null;
        this.branch_name = "";
        this.quantity = null;
        this.remarks = "";
    }

    id?: number;
    status: string;
    delivery_date: string;
    branch_id: number;
    branch_name: string;
    quantity: number;
    remarks: string;
    branch_type?: string;


}