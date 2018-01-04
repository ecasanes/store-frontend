import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs/Observable";

import {HttpService} from "../helpers/http.service";
import {NewDelivery} from '../../../classes';

@Injectable()
export class DeliveryService {

    basePath: string = 'api/deliveries';
    productDeliveriesPath: string = "api/products/deliveries";

    constructor(private httpService: HttpService) {

    }

    addDelivery(delivery: NewDelivery): Observable<any> {

        const body = JSON.stringify(delivery);

        const requestUrl = this.productDeliveriesPath;

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    addConfirmedDelivery(delivery: NewDelivery): Observable<any> {

        const body = JSON.stringify(delivery);

        const requestUrl = this.productDeliveriesPath + '/confirm';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    updateDelivery(delivery: NewDelivery): Observable<any> {

        const body = JSON.stringify(delivery);

        const requestUrl = this.productDeliveriesPath+'/'+delivery.id;

        return this.httpService.put(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    returnDelivery(delivery: NewDelivery): Observable<any> {

        const body = JSON.stringify(delivery);

        const requestUrl = this.productDeliveriesPath+'/return';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    getDeliveries(pageNumber: number, limit?: number): Observable<any> {

        if(typeof pageNumber == 'undefined'){
            pageNumber = 1;
        }

        if(typeof limit == 'undefined'){
            limit = 10;
        }

        let requestUrl = this.basePath+"?page="+pageNumber+"&limit="+limit;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getDeliveryItems(deliveryId: number): Observable<any> {

        let requestUrl = this.basePath+"/"+deliveryId+"/items";

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    confirmDelivery(deliveryId: number): Observable<any> {

        const requestUrl = this.productDeliveriesPath+"/"+deliveryId+"/confirm";

        return this.httpService.post(requestUrl, {})
            .map(
                (response: Response) => response.json().data
            );
    }

    voidDelivery(deliveryId: number): Observable<any> {

        const requestUrl = this.productDeliveriesPath+"/"+deliveryId+"/void";

        return this.httpService.post(requestUrl, {})
            .map(
                (response: Response) => response.json().data
            );
    }

}