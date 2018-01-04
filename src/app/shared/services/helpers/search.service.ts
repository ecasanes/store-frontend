import {EventEmitter, Injectable} from "@angular/core";
import "rxjs/Rx";

@Injectable()
export class SearchService {

    isOn: EventEmitter<boolean> = new EventEmitter<boolean>(true);
    query: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    updateQuery(searchKey: string){

        this.query.emit(searchKey);

    }




}