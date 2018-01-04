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

@Injectable()
export class ProductService {

    basePath: string = 'api/products';

    constructor(private httpService: HttpService) {

    }

    getProducts(pageNumber: number, categoryId?: number, query?: string, limit?: number): Observable<any> {

        if (typeof pageNumber == 'undefined') {
            pageNumber = 1;
        }

        if (typeof limit == 'undefined') {
            limit = 10;
        }

        if (typeof query == 'undefined') {
            query = "";
        }

        let requestUrl = this.basePath + "?page=" + pageNumber + "&limit=" + limit + "&q=" + query;


        if (typeof categoryId !== 'undefined' && !isNaN(categoryId) && categoryId != null) {
            requestUrl += "&category_id=" + categoryId;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('get products response: ', response.json());
                    return response.json();
                }
            )
    }

    getAllProductVariations(branchId?: number, categoryId?: number): Observable<any> {

        const limit = Constants.getNone;

        let requestUrl = this.basePath + "?limit=" + limit;

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "&branch_id=" + branchId;
        }

        if (typeof categoryId !== 'undefined' && !isNaN(categoryId) && categoryId != null) {
            requestUrl += "&category_id=" + categoryId;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getAlerts(branchId: number = null): Observable<any> {

        let requestUrl = this.basePath+'/alerts';

        if (typeof branchId !== 'undefined' && !isNaN(branchId) && branchId != null) {
            requestUrl += "?branch_id=" + branchId;
        }

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getProductVariationsByProductId(productId: number): Observable<any> {

        let requestUrl = this.basePath + "/" + productId + "/variations";

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )
    }

    getCategoriesFromModal() {

        const requestUrl = this.basePath + "/categories";

        return this.httpService.getFromModal(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )

    }

    addProduct(product: NewProduct) {

        const body = JSON.stringify(product);

        const requestUrl = this.basePath;

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    updateProduct(product: Product) {

        const body = JSON.stringify(product);

        const requestUrl = this.basePath + '/variations/' + product.product_variation_id + '?include_product=1';

        return this.httpService.put(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    restockProduct(product: Product) {

        const body = JSON.stringify(product);

        const requestUrl = this.basePath + '/variations/' + product.product_variation_id + '/stocks';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    returnStockProduct(product: Product) {

        const body = JSON.stringify(product);

        const requestUrl = this.basePath + '/variations/' + product.product_variation_id + '/stocks/return';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    deleteProduct(id: number) {

        const requestUrl = this.basePath + '/variations/' + id;

        return this.httpService.destroy(requestUrl)
            .map(
                (response: Response) => response.json().data
            );
    }

    uploadProductImage(productId: number, productImage: File) {

        const requestUrl = this.basePath + "/" + productId + "/upload";

        if(typeof productImage == 'undefined'){
            return Observable.throw(false);
        }

        if(typeof productImage.name == 'undefined'){
            return Observable.throw(false);
        }

        const body = new FormData();
        body.append("image", productImage, productImage.name);

        return this.httpService.upload(requestUrl, body)
            .map(
                (response: Response) => response.json()
            );

    }

    getCompanyStocks(query?: string): Observable<any> {

        if (typeof query == 'undefined') {
            query = "";
        }

        let requestUrl = this.basePath + "/stocks?q=" + query;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('get products response: ', response.json());
                    return response.json();
                }
            )
    }

    getStocksByBranch(branchId?: number, query?: string): Observable<any> {

        if (typeof query == 'undefined') {
            query = "";
        }

        let requestUrl = this.basePath + "/stocks/branches/" + branchId + "?q=" + query;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('get products response: ', response.json());
                    return response.json();
                }
            )
    }

}