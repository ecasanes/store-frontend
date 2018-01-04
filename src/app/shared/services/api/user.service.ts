import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import "rxjs/Rx";

import {HttpService} from "../helpers/http.service";
import {AuthService} from '../api/auth.service';
import {User} from '../../../classes';
import {Observable} from "rxjs/Observable";

@Injectable()
export class UserService {

    basePath: string = 'api/users';

    constructor(private http: Http, private authService: AuthService, private httpService: HttpService) {

    }

    getUsers() {

        const requestUrl = this.basePath;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    getCustomerByMemberId(memberId: number) {

        const requestUrl = this.basePath + "/customers/" + memberId;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    getUserCount(range:string = 'month', branchId: number = null, role:string = 'member'): Observable<any> {

        let requestUrl = this.basePath+'/count?range='+range;

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        if (typeof role !== 'undefined' && role != null) {
            requestUrl += "&role=" + role;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    createUser(user: User) {

        const userData = JSON.stringify(user);
        console.log("the user data to be saved", userData);
        const requestUrl = this.basePath;

        return this.httpService.post(requestUrl, userData)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    updateUser(id: number, user: User) {

        const userData = JSON.stringify(user);

        var requestUrl: string = this.basePath + '/' + id;


        return this.httpService.put(requestUrl, userData)
            .map(
                (response: Response) => response.json().data
            );
    }

    deleteUser(id: number) {

        let requestUrl: string = this.basePath + '/' + id;

        return this.httpService.destroy(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }

}