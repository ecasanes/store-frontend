import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import "rxjs/Rx";

import {HttpService} from "../helpers/http.service";
import {ProductCategory} from '../../../classes';
import {Observable} from "rxjs/Observable";

@Injectable()
export class CategoryService {

    basePath: string = 'api/products/categories';

    constructor(private httpService: HttpService) {

    }

    getCategories(pageNumber?:number, query?:string, limit?:number): Observable<any> {

        if(typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if(typeof query == 'undefined') {
            query = "";
        }

        if(typeof limit == 'undefined') {
            limit = 10;
        }

        const requestUrl = this.basePath + '?page=' + pageNumber + '&limit=' + limit + '&q=' + query;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {

                    return response.json();
                }
            )

    }

    addCategory(category: ProductCategory) {

        const body = JSON.stringify(category);

        const requestUrl = this.basePath;

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    updateCategory(category: ProductCategory) {

        const body = JSON.stringify(category);

        const requestUrl = this.basePath + '/' + category.id;

        return this.httpService.put(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            )
    }

    deleteCategory(id: number) {

        const requestUrl = this.basePath + '/' + id;

        return this.httpService.destroy(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }
}