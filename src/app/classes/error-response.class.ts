export class ErrorResponse {

    constructor(){
        this.errors = {};
        this.data = [];
        this.message = "";
    }

    type:string;
    errors: {};
    data:any[];
    message:string;


}