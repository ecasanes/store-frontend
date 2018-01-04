import {ProductVariation} from "./index";
export class Branch {


    constructor() {
        this.name = '';
        this.address = '';
        this.city = '';
        this.zip = '';
        this.province = '';
        this.phone = '';
        this.status = '';
        this.company_id = null;
        this.type = '';

        this.isViewed = false;
        this.items = [];
    }

    id?: number;
    name: string;
    address: string;
    city: string;
    zip: string;
    province: string;
    phone: string;
    status: string;
    company_id: number;
    key: string;
    type: string;

    // for new branch
    email: string;
    password: string;
    firstname: string;
    lastname: string;

    // for getting single branch with other info
    owner_user_id: number;
    staff_count: number;

    isViewed: boolean;
    items: ProductVariation[];

    setEmptyItems() {
        this.items = [];
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
}