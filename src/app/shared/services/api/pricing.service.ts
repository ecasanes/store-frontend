import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import "rxjs/Rx";

import {HttpService} from "../helpers/http.service";
import {AuthService} from '../api/auth.service';
import {Pricing} from '../../../classes';
import {Observable} from "rxjs/Observable";

@Injectable()

export class PricingService {

    basePath: string = 'api/pricing';

    constructor(
        private http: Http,
        private authService: AuthService,
        private httpService: HttpService
    ) {

    }

    getAllPricingRules(pageNumber: number, query?: string, limit?: number):Observable<any> {

        if(typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if(typeof limit == 'undefined') {
            limit = 10;
        }

        if(typeof query == 'undefined') {
            query = '';
        }

        let requestUrl = this.basePath + '?page=' + pageNumber + '&limit=' + limit + '&q=' + query;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    createPricingRule(data: Pricing) {

        const requestUrl = this.basePath;
        const body = JSON.stringify(data);

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    updatePricingRule(data: Pricing, status?: string) {

        if(status) {
            data.status = status;
        }

        const requestUrl = this.basePath + '/' + data.id;

        console.log('the data to be updated', data);

        const body = JSON.stringify(data);

        return this.httpService.put(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    deletePricingRule(id: number) {

        const requestUrl = this.basePath + '/' + id;

        return this.httpService.destroy(requestUrl)
            .map(
                (response: Response) => response.json()
            );
    }

}