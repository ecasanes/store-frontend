import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {Observable} from "rxjs/Observable";

import {HttpService} from "../helpers/http.service";
import {
    NewProduct,
    Product
} from '../../../classes';
import {Constants} from "../../constants";
import {Transaction} from "../../../classes/transaction.class";

@Injectable()
export class TransactionService {

    basePath: string = 'api/transactions';
    trackingPath: string = 'api/tracking/transactions';
    productsBasePath: string = 'api/products/transactions';

    constructor(private httpService: HttpService) {

    }

    findTransaction(transactionId: number) {

        const requestUrl = this.productsBasePath + '/' + transactionId;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json()
            );
    }

    findSaleByOr(orNumber: string, includeVoid: boolean = true, branchId: number = null) {

        let requestUrl = this.productsBasePath + '/sales/' + orNumber + "?include_void=" + includeVoid;

        if(branchId !== null && typeof branchId !== 'undefined' && !isNaN(branchId)){
            requestUrl += "&branch_id=" + branchId;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json()
            );
    }

    getTransactionsByType(type: string, pageNumber?: number, query?: string, limit?: number): Observable<any> {

        if (typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if (typeof limit == 'undefined') {
            limit = 10;
        }

        if (typeof query == 'undefined') {
            query = "";
        }

        let requestUrl = this.basePath + "?page=" + pageNumber + "&limit=" + limit + "&q=" + query + "&transaction_type=" + type;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getSaleTransactions(pageNumber: number, branchId?: number, sort?: string, order?: string, query?: string, limit?: number): Observable<any> {

        if (typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if (typeof limit == 'undefined') {
            limit = 10;
        }

        if (typeof query == 'undefined') {
            query = "";
        }

        if (typeof order == 'undefined' || order == "" || order == null) {
            order = "DESC";
        }

        if (typeof sort == 'undefined' || sort == "" || sort == null) {
            sort = "date";
        }

        const saleString = Constants.getSaleGroup;

        let requestUrl = this.basePath + "?page=" + pageNumber + "&limit=" + limit + "&q=" + query + "&group=" + saleString + "&exclude_void=1&order=" + order + "&sort=" + sort;

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        console.log('the requestUrl', requestUrl);

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getTotalSales(range: string = 'month', branchId: number = null, subType?: string): Observable<any> {

        let requestUrl = this.productsBasePath + '/sales/total?range=' + range;

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        if (typeof subType !== 'undefined' && subType != null) {
            requestUrl += "&sub_type=" + subType;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getSalesSummary(from: string, to: string, branchId: number = null): Observable<any> {

        let requestUrl = this.productsBasePath + '/sales/summary?version=1';

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        if (typeof from !== 'undefined' && from != null) {
            requestUrl += "&from=" + from;
        }

        if (typeof to !== 'undefined' && to != null) {
            requestUrl += "&to=" + to;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getProductsSalesSummary(from: string, to: string, branchId: number = null, range: string = null, excludeEmpty: number = 0, subType?: string): Observable<any> {

        let requestUrl = this.productsBasePath + '/sales/items/summary?version=1';

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        if (typeof from !== 'undefined' && from != null && range == null) {
            requestUrl += "&from=" + from;
        }

        if (typeof to !== 'undefined' && to != null && range == null) {
            requestUrl += "&to=" + to;
        }

        if (typeof range !== 'undefined' && range != null) {
            requestUrl += "&range=" + range;
        }

        if (typeof subType !== 'undefined' && subType != null) {
            requestUrl += "&sub_type=" + subType;
        }

        requestUrl += "&exclude_empty=" + excludeEmpty;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getDailySalesSummary(from: string, to: string, branchId: number = null, range: string = null): Observable<any> {

        let requestUrl = this.productsBasePath + '/sales/summary/daily?version=1';

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        if (typeof from !== 'undefined' && from != null && range == null) {
            requestUrl += "&from=" + from;
        }

        if (typeof to !== 'undefined' && to != null && range == null) {
            requestUrl += "&to=" + to;
        }

        if (typeof range !== 'undefined' && range != null) {
            requestUrl += "&range=" + range;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getTopSaleItems(from: string, to: string, branchId: number = null): Observable<any> {

        let requestUrl = this.productsBasePath + '/sales/top?version=1';

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        if (typeof from !== 'undefined' && from != null) {
            requestUrl += "&from=" + from;
        }

        if (typeof to !== 'undefined' && to != null) {
            requestUrl += "&to=" + to;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getAdjustmentTransactions(pageNumber: number, query?: string, limit?: number): Observable<any> {

        if (typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if (typeof limit == 'undefined') {
            limit = 10;
        }

        if (typeof query == 'undefined') {
            query = "";
        }

        const groupCode = Constants.adjustmentGroup;

        let requestUrl = this.basePath + "?page=" + pageNumber + "&limit=" + limit + "&q=" + query + "&group=" + groupCode + "&exclude_void=1";

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getSaleTransactionTypes() {

        const saleGroup = Constants.getSaleGroup;

        let requestUrl = this.basePath + '/types' + '?group=' + saleGroup;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('sale transaction types', response.json());
                    return response.json();
                }
            )

    }

    getTransactionTypesByGroup(group: string) {

        let requestUrl = this.basePath + '/types' + '?group=' + group;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('transaction types', response.json());
                    return response.json();
                }
            )

    }

    addSaleTransaction(transaction: Transaction) {

        const body = JSON.stringify(transaction);

        const requestUrl = this.trackingPath + '/sale';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    createSaleTransaction(transaction: Transaction) {

        const body = JSON.stringify(transaction);

        const requestUrl = this.basePath + '/sale';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );

    }

    voidTransaction(transactionId: number) {

        let body = {};

        const requestUrl = this.productsBasePath + '/' + transactionId + '/void';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    calculateDiscount(transaction: Transaction) {

        const body = JSON.stringify(transaction);

        const requestUrl = this.trackingPath + '/discounts/calculate';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json()
            );
    }

    getItemBranchLedger(productVariationId: number, branchId: number = null, page: number = 1, order: string = "desc", from:string = null, to: string = null): Observable<any> {

        let ledgerType = 'warehouse';

        if (typeof branchId !== 'undefined' && branchId !== null && !isNaN(branchId)) {
            ledgerType = 'branch';
        }

        let requestUrl = this.productsBasePath + "/ledger/" + ledgerType + "?" +
            "product_variation_id=" + productVariationId +
            "&sort=date_id" +
            "&page=" + page;

        if (typeof branchId !== 'undefined' && branchId !== null && !isNaN(branchId)) {
            requestUrl += "&branch_id=" + branchId;
        }

        if(typeof order !== 'undefined' && order !== null && order !== ""){
            requestUrl += "&order=" + order;
        }

        if(typeof from !== 'undefined' && from !== null && from !== ""){
            requestUrl += "&from=" + from;
        }

        if(typeof to !== 'undefined' && to !== null && to !== ""){
            requestUrl += "&to=" + to;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )

    }
}