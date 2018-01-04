import {ProductVariation} from "./index";
export class NewBranch {

    constructor(){
        this.name = "";
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
    override_default_store_time: number;
    default_start_time: string;
    default_end_time: string;
    company_id: number;
    key: string;

    // for new branch
    email: string;

    // for getting single branch with other info
    owner_name: string;
    owner_user_id: number;
    staff_count: number;

    isViewed:boolean;
    items: ProductVariation[];

    setEmptyItems(){
        this.items = [];
    }

    isEmpty(){

        if(typeof this.items == null){
            this.items = [];
        }

        if(this.items.length > 0){
            return false;
        }

        return true;

    }

}