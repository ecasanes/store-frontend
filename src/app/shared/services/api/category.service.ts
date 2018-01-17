import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import "rxjs/Rx";

import {HttpService} from "../helpers/http.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CategoryService {

    basePath: string = 'api/products/categories';

    constructor(private httpService: HttpService) {

    }

    getCategories(withProducts: boolean = false, pageNumber?:number, query?:string, limit?:number): Observable<any> {

        if(typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if(typeof query == 'undefined') {
            query = "";
        }

        if(typeof limit == 'undefined') {
            limit = 10;
        }

        let requestUrl = this.basePath + '?page=' + pageNumber + '&limit=' + limit + '&q=' + query;

        if(withProducts){
            requestUrl += "&with_products=1";
        }

        return this.httpService.getPublic(requestUrl)
            .map(
                (response: Response) => {

                    return response.json();
                }
            )

    }

}