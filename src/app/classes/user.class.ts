export class User {

    constructor(){
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.branch_id = null;
        this.branch_id_registered = null;
        this.password = "";
        this.phone = "";
        this.address = "";
        this.city = "";
        this.province = "";
        this.zip = "";
        this.permissions;

    }

    id?: number;
    role: string;
    staff_id: string;
    customer_id: string;
    firstname: string
    lastname: string;
    branch_name: string;
    email: string;
    password: string;
    branch_id: number;
    branch_id_registered: number;
    branch_registered: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    zip:string;
    permissions:any[];
    confirm_password:string;
    can_void: number = 0;
    has_multiple_access: number = 0;
    sold_items:number = 0;

}