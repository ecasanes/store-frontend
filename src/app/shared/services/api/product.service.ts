import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
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

    getProducts(pageNumber: number, categoryId?: number, query?: string, limit?: any, userId?: number): Observable<any> {

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

        if (typeof userId !== 'undefined' && !isNaN(userId) && userId != null) {
            requestUrl += "&user_id=" + userId;
        }

        if (typeof categoryId !== 'undefined' && !isNaN(categoryId) && categoryId != null) {
            requestUrl += "&category_id=" + categoryId;
        }

        return this.httpService.getPublic(requestUrl)
            .map(
                (response: Response) => {
                    console.log('get products response: ', response.json());
                    return response.json();
                }
            )
    }

    getAllProducts(storeId?: number, categoryId?: number): Observable<any> {

        const limit = Constants.getNone;

        let requestUrl = this.basePath + "?limit="+limit;

        if (typeof storeId !== 'undefined' && !isNaN(storeId) && storeId != null) {
            requestUrl += "&store_id=" + storeId;
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

    getAllPaymentMethods(): Observable<any> {

        let requestUrl = this.basePath + "/payments/methods";

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json().data;
                }
            )
    }

    getAllVouchers(): Observable<any> {

        let requestUrl = this.basePath + "/vouchers";

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json().data;
                }
            )
    }

    addVoucher(voucherData: any): Observable<any> {

        const body = JSON.stringify(voucherData);

        let requestUrl = this.basePath + "/vouchers";

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json().data;
                }
            )
    }

    updateVoucher(voucherData: any): Observable<any> {

        const body = JSON.stringify(voucherData);

        let requestUrl = this.basePath + "/vouchers/" + voucherData.id;

        return this.httpService.put(requestUrl, body)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json().data;
                }
            )
    }

    deleteVoucher(voucherId: number): Observable<any> {

        let requestUrl = this.basePath + "/vouchers/" + voucherId;

        return this.httpService.destroy(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json().data;
                }
            )
    }

    getCategoriesFromModal() {

        const requestUrl = this.basePath + "/categories?limit=none";

        return this.httpService.getFromModal(requestUrl)
            .map(
                (response: Response) => {
                    console.log('response: ', response.json());
                    return response.json();
                }
            )

    }

    getConditionsFromModal() {

        const requestUrl = this.basePath + "/conditions?limit=none";

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

    restockProduct(storeId: number, product: Product) {

        const body = JSON.stringify(product);

        const requestUrl = this.basePath + '/stocks/stores/' + storeId;

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );
    }

    addToWishlist(userId: number, productVariationId: number) {

        const body = JSON.stringify({
            user_id: userId,
            product_variation_id: productVariationId
        });

        const requestUrl = this.basePath + '/wishlists';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );

    }

    removeInWishlist(userId: number, productVariationId: number) {

        const body = JSON.stringify({
            user_id: userId,
            product_variation_id: productVariationId
        });

        const requestUrl = this.basePath + '/wishlists/remove';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );

    }

    addToCart(userId: number, productVariationId: number, quantity: number = 1) {

        const body = JSON.stringify({
            product_variation_id: productVariationId,
            cart_quantity: quantity
        });

        const requestUrl = this.basePath + '/carts/' + userId;

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );

    }

    removeInCart(userId: number, productVariationId: number) {

        const body = JSON.stringify({
            user_id: userId,
            product_variation_id: productVariationId
        });

        const requestUrl = this.basePath + '/carts/remove';

        return this.httpService.post(requestUrl, body)
            .map(
                (response: Response) => response.json().data
            );

    }

    getCurrentCartCount(userId: number) {

        const requestUrl = this.basePath + '/carts/' + userId + '/count';

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => response.json().data
            );

    }

    deleteProduct(id: number) {

        const requestUrl = this.basePath + '/' + id;

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

    getVoucherByCode(voucherCode: string) {

        let requestUrl = this.basePath + "/vouchers/validate?code=" + voucherCode;

        return this.httpService.get(requestUrl)
            .map(
                (response: Response) => {
                    return response.json().data;
                }
            )

    }
}