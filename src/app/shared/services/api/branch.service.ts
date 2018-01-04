import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs/Observable";

import {HttpService} from "../helpers/http.service";
import {Branch} from '../../../classes';

@Injectable()
export class BranchService {

    basePath: string = 'api/branches';

    constructor(private httpService: HttpService) {

    }

    addBranch(branch: Branch): Observable<any> {

        const body = JSON.stringify(branch);

        const requestUrl = this.basePath;

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );

    }

    updateBranch(branch: Branch): Observable<any> {

        const body = JSON.stringify(branch);
        const branchId = branch.id;
        const requestUrl = this.basePath + '/' + branchId;

        return this.httpService.put(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );

    }

    getBranches(branchType?:string): Observable<any> {

        if(typeof branchType == 'undefined' || branchType == null || branchType == "all"){
            branchType = "";
        }

        let requestUrl = this.basePath + "?type="+branchType;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    getBranchById(branchId: number, excludeStocks: number = 0): Observable<any> {

        let requestUrl = this.basePath + "/" + branchId + "?exclude_stocks="+excludeStocks;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    deleteBranch(branchId: number): Observable<any> {

        const requestUrl = this.basePath+'/'+branchId;

        return this.httpService.destroy(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }
}