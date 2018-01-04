import {Injectable} from "@angular/core";
import "rxjs/Rx";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";

import {AuthService} from '../api/auth.service';

@Injectable()
export class RouterService {

    constructor(private activeRoute: ActivatedRoute, private authService: AuthService) {

    }

    test() : Observable<any>{

        /*if(!this.authService.isLoggedIn()){
            this.authService.showModal.emit(true);
            return Observable.throw('Unable to re-authenticate');
        }*/

        return Observable.create(observer => {
            return this.activeRoute.params.subscribe(r => {
                observer.next(r);
                observer.complete();
            });
        });

    }


}