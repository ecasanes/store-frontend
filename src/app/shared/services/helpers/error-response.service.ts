import {Injectable} from "@angular/core";
import "rxjs/Rx";
import {ErrorResponse} from "../../../classes";

@Injectable()
export class ErrorResponseService {

    errorResponse: ErrorResponse;

    constructor() {
        this.errorResponse = new ErrorResponse();
        this.errorResponse.errors = {};
    }

    init(initialErrors?: string[]) {

        const errorResponse = this.errorResponse;

        if(typeof initialErrors !== 'undefined'){
            initialErrors.forEach(function (key) {
                errorResponse.errors[key] = [""];
            });
        }


        return errorResponse;

    }

    handleError(error: any) {

        console.log('handle Error: ', error);

        const jsonResponse = JSON.parse(error._body);

        console.log('json response: ', jsonResponse);

        return jsonResponse;

    }


}