import {EventEmitter, Injectable} from "@angular/core";
import "rxjs/Rx";

import {ProductCategory} from "../../../classes";

@Injectable()
export class DashboardEventService {

    public onGetCategories: EventEmitter<ProductCategory[]> = new EventEmitter<ProductCategory[]>();
    public onCartChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {

    }

    triggerGetCategories(categories: ProductCategory[]){
        this.onGetCategories.emit(categories);
    }


}