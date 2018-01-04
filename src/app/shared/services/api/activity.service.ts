import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import "rxjs/Rx";

import {HttpService} from "../helpers/http.service";
import {ActivityLog} from '../../../classes';
import {Observable} from "rxjs/Observable";

@Injectable()

export class ActivityService {

    basePath: string = 'api/logs';

    constructor(private httpService: HttpService) {

    }

    getLimitedActivities(limit:number, activityLogTypes:string[] = [], orderBy: string = 'DESC'): Observable<any> {

        return this.getActivities(undefined, undefined, undefined, limit, null, orderBy, null, activityLogTypes);

    }

    getActivities(pageNumber?:number, activityLogTypeId?: number, query?:string, limit?:any, isTransaction?: any,
                  orderBy?: any, branchId?: any, activityLogTypes:string[] = []): Observable<any> {

        if(typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if(typeof limit == 'undefined' || limit == null) {
            limit = 10;
        }

        if(typeof isTransaction == 'undefined') {
            isTransaction = false;
        }

        if(typeof orderBy == 'undefined') {
            orderBy = 'DESC';
        }

        let requestUrl = this.basePath + '?page=' + pageNumber + '&limit=' + limit + '&order_by=' + orderBy;

        if(typeof query != 'undefined' && query != null) {
            requestUrl += "&q=" + query;
        }

        if(isTransaction !== null){
            requestUrl += "&is_transaction=" + isTransaction;
        } else {
            requestUrl += "&is_transaction=0";
        }

        if (typeof activityLogTypeId !== 'undefined' && !isNaN(activityLogTypeId) && activityLogTypeId != null) {
            requestUrl += "&activity_type_id=" + activityLogTypeId;
        }

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        if (activityLogTypes.length>0 && activityLogTypes != null && typeof activityLogTypes !== 'undefined'){
            requestUrl += "&activity_log_types=" + activityLogTypes.join(',');
        }

        console.log('the request url', requestUrl);

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {

                    return response.json();
                }
            );

    }

    getTransactionActivityTypes(isTransaction:number=1, activityLogTypes:string[] = []) {

        let requestUrl = this.basePath + '/types?version=1';

        if(typeof isTransaction == 'undefined') {
            isTransaction = 1;
        }

        if(isTransaction !== null){
            requestUrl += "&is_transaction=" + isTransaction;
        }

        if (activityLogTypes.length>0 && activityLogTypes != null && typeof activityLogTypes !== 'undefined'){
            requestUrl += "&activity_log_types=" + activityLogTypes.join(',');
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {

                    return response.json();

                }
            );
    }



    logActivity() {

    }

    getActivityByUserId(id: number) {

    }

    getActivityByEmail(email: string) {

    }

}