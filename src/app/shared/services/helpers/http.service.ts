import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptionsArgs, Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs/Observable";

import {AuthService} from "../api/auth.service";
import {Constants} from '../../constants'

@Injectable()
export class HttpService {

    baseUrl: string = Constants.baseUrl;

    constructor(private http: Http, public authService: AuthService) {

    }

    public get(path: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authService.authenticate().flatMap(authenticated => {
            if (authenticated) {

                const requestUrl = this.getRequestUrl(path);
                const requestOptions = this.getOptions(options);

                return this.http.get(requestUrl, requestOptions)
            }
            else {
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    public getPublic(path: string, options?: RequestOptionsArgs): Observable<Response> {

        const requestUrl = this.getRequestUrl(path);
        const requestOptions = this.getOptions(options);

        return this.http.get(requestUrl, requestOptions)

    }

    public getFromModal(path: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authService.authenticateFromModal().flatMap(authenticated => {
            if (authenticated) {

                const requestUrl = this.getRequestUrl(path);
                const requestOptions = this.getOptions(options);

                return this.http.get(requestUrl, requestOptions)
            }
            else {
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    public post(path: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authService.authenticate().flatMap(authenticated => {
            if (authenticated) {

                const requestUrl = this.getRequestUrl(path);
                const requestOptions = this.getOptions(options);

                console.log('POST - body: ', body);

                return this.http.post(requestUrl, body, requestOptions);
            }
            else {
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    public postPublic(path: string, body: any, options?: RequestOptionsArgs): Observable<Response> {


        const requestUrl = this.getRequestUrl(path);
        const requestOptions = this.getOptions(options);

        console.log('POST - body: ', body);

        return this.http.post(requestUrl, body, requestOptions);

    }

    public put(path: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authService.authenticate().flatMap(authenticated => {
            if (authenticated) {

                const requestUrl = this.getRequestUrl(path);
                const requestOptions = this.getOptions(options);

                console.log('PUT - body: ', body);

                return this.http.put(requestUrl, body, requestOptions);
            }
            else {
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    public destroy(path: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authService.authenticate().flatMap(authenticated => {
            if (authenticated) {

                const requestUrl = this.getRequestUrl(path);
                const requestOptions = this.getOptions(options);

                return this.http.delete(requestUrl, requestOptions);
            }
            else {
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    public upload(path: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authService.authenticate().flatMap(authenticated => {
            if (authenticated) {

                const requestUrl = this.getRequestUrl(path);
                let requestOptions = this.getUploadOptions(options);

                console.log('UPLOAD|POST - body: ', body);

                return this.http.post(requestUrl, body, requestOptions);
            }
            else {
                return Observable.throw('Unable to re-authenticate');
            }
        });
    }

    public getRequestUrl(path: string, hasToken: boolean = false) {

        const tokenString = this.getTokenString();
        let requestUrl = this.baseUrl + path + tokenString;

        if (!hasToken) {
            requestUrl = this.baseUrl + path;
        }

        console.log('REQUEST URL: ', requestUrl);

        return requestUrl;
    }

    public getTokenString() {
        return "&token=" + this.authService.getToken()
    }

    public getDefaultHeaders() {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authService.getToken(),
            'Accept': 'application/json'
        });
    }

    public getUploadHeaders() {
        return new Headers({
            //'Content-Type': undefined,
            //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; multipart/form-data',
            //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8; multipart/form-data',
            'Authorization': 'Bearer ' + this.authService.getToken(),
            'Accept': 'application/json'
        });
    }

    private getOptions(options?: RequestOptionsArgs) {

        if (typeof options === 'undefined') {
            options = {headers: this.getDefaultHeaders()};
            return options;
        }

        if (typeof options.headers === 'undefined') {
            options.headers = this.getDefaultHeaders();
        }

        return options;
    }

    private getUploadOptions(options?: RequestOptionsArgs) {

        if (typeof options === 'undefined') {
            options = {headers: this.getUploadHeaders()};
            return options;
        }

        if (typeof options.headers === 'undefined') {
            options.headers = this.getUploadHeaders();
        }

        return options;
    }
}