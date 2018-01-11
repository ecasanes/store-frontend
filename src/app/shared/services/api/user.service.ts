import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import "rxjs/Rx";

import {HttpService} from "../helpers/http.service";
import {AuthService} from '../api/auth.service';
import {User} from '../../../classes';
import {Constants} from "../../constants";

@Injectable()
export class UserService {

    basePath: string = 'api/users';

    constructor(private http: Http, private authService: AuthService, private httpService: HttpService) {

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

    createUserPublic(user: User) {

        const userData = JSON.stringify(user);
        console.log("the user data to be saved", userData);
        const requestUrl = "api/buyers/new";

        return this.httpService.postPublic(requestUrl, userData)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
    }

    deleteUser(id: number) {

        let requestUrl: string = this.basePath + '/' + id;

        return this.httpService.destroy(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }

    getCurrentUserProfile() {

        const requestUrl = this.basePath + "/current";

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )

    }

    getAllSellers() {

        const requestUrl = this.basePath + "?limit=none&role=" + Constants.sellerRole;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )

    }

    getAllBuyers() {

        const requestUrl = this.basePath + "?limit=none&role=" + Constants.buyerRole;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json();
                }
            )

    }

}