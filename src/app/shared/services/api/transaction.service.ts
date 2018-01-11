import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import "rxjs/Rx";

import {Observable} from "rxjs/Observable";

import {HttpService} from "../helpers/http.service";
import {Order} from "../../../classes/order.class";

@Injectable()
export class TransactionService {

    basePath: string = 'api/orders';

    constructor(private httpService: HttpService) {

    }

    addOrder(order: Order): Observable<any> {

        const body = JSON.stringify(order);

        const requestUrl = this.basePath;

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    getCurrentBuyerToPayTransactions(): Observable<any> {

        let requestUrl = this.basePath + '/buyers/current?buyer_status=to_pay';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }

    getCurrentBuyerPaidTransactions(): Observable<any> {

        let requestUrl = this.basePath + '/buyers/current?buyer_status=paid';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }

    getCurrentBuyerToShipTransactions(): Observable<any> {

        let requestUrl = this.basePath + '/buyers/current?seller_status=to_ship';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }

    getCurrentBuyerOnDeliveryTransactions(): Observable<any> {

        let requestUrl = this.basePath + '/buyers/current?seller_status=shipped';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }

    getCurrentBuyerCompletedTransactions(): Observable<any> {

        let requestUrl = this.basePath + '/buyers/current?seller_status=completed&buyer_status=completed';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }

    receiveOrderByTransactionId(transactionId: number) {

        let requestUrl = this.basePath + '/transactions/' + transactionId + '/receive';

        return this.httpService.put(requestUrl,{})
            .map(
                (response: Response) => response.json().data
            );

    }

    shipOrderByTransactionId(transactionId: number) {

        let requestUrl = this.basePath + '/transactions/' + transactionId + '/ship';

        return this.httpService.put(requestUrl,{})
            .map(
                (response: Response) => response.json().data
            );

    }

    getCurrentSellerToPayTransactions() {

        let requestUrl = this.basePath + '/sellers/current?buyer_status=to_pay';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getCurrentSellerToShipTransactions() {

        let requestUrl = this.basePath + '/sellers/current?seller_status=to_ship';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getCurrentSellerShippedTransactions() {

        let requestUrl = this.basePath + '/sellers/current?seller_status=shipped';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getCurrentSellerToReceiveTransactions() {

        let requestUrl = this.basePath + '/sellers/current?seller_status=delivered&buyer_status=received';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getCurrentSellerReceivedTransactions() {

        let requestUrl = this.basePath + '/sellers/current?seller_status=received&buyer_status=received';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getCurrentSellerCompletedTransactions() {

        let requestUrl = this.basePath + '/sellers/current?seller_status=completed&buyer_status=completed';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getAllToPayTransactions() {

        let requestUrl = this.basePath + '?buyer_status=to_pay';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getAllToShipTransactions() {

        let requestUrl = this.basePath + '?seller_status=to_ship';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getAllShippedTransactions() {

        let requestUrl = this.basePath + '?seller_status=shipped';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getAllCompletedTransactions() {

        let requestUrl = this.basePath + '?seller_status=completed&buyer_status=completed';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    getAllPaidTransactions() {

        let requestUrl = this.basePath + '?buyer_status=paid';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    receivePaymentByTransactionId(transactionId: number) {

        let requestUrl = this.basePath + '/transactions/' + transactionId + '/receive-payment';

        return this.httpService.put(requestUrl,{})
            .map(
                (response: Response) => response.json().data
            );

    }

    getAllToBeCompletedTransactions() {

        let requestUrl = this.basePath + '?buyer_status=received&seller_status=received';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    completeTransactionById(transactionId: number) {

        let requestUrl = this.basePath + '/transactions/' + transactionId + '/complete';

        return this.httpService.put(requestUrl,{})
            .map(
                (response: Response) => response.json().data
            );

    }
}