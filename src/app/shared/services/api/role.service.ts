import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {AuthService} from "../api/auth.service";
import {HttpService} from '../helpers/http.service';
import {Observable} from "rxjs/Observable";

@Injectable()
export class RoleService {

    basePath: string = '/api/users';

    constructor(private http: Http, private authService: AuthService, private httpService: HttpService) {

    }

    getStaffRoles(pageNumber: number, query?: string, limit: any = 'none'):Observable<any> {

        if(typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if(typeof limit == 'undefined') {
            limit = 10;
        }

        if(typeof query == 'undefined') {
            query = '';
        }

        const requestUrl = this.basePath + '?role=staff&page=' + pageNumber + '&limit=' + limit + '&q=' + query;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    getMemberRoles(pageNumber: number, query?: string, limit?: number, branchId?: number):Observable<any> {

        if(typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if(typeof limit == 'undefined') {
            limit = 10;
        }

        if(typeof query == 'undefined') {
            query = '';
        }

        let requestUrl = this.basePath + '?role=member&page=' + pageNumber + '&limit=' + limit + '&q=' + query;

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    getCompanyStaffRoles(pageNumber: number, query?: string, limit?: number):Observable<any> {

        if(typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if(typeof limit == 'undefined') {
            limit = 10;
        }

        if(typeof query == 'undefined') {
            query = '';
        }

        const requestUrl = this.basePath + '?role=company_staff&page=' + pageNumber + '&limit=' + limit + '&q=' + query;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    getCompanyStaffPermissions(id: number) {
        const requestUrl = this.basePath + '/permissions/' + id;
        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )

    }

}