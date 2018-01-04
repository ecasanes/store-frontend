import {Injectable} from "@angular/core";
import { Response } from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs/Observable";

import {HttpService} from "../helpers/http.service";

@Injectable()
export class ExportService {

    constructor(private httpService: HttpService) {

    }

    exportUserData(customers, filters?: any) {

        let basePath: string = 'api/users';

        const requestUrl = basePath + '/export';

        console.log('filters object', filters);

        if (filters.from == 'null--' || filters.from == 'undefined--') {
            filters.from = null;
        }

        if (filters.to == 'null--' || filters.to == 'undefined--') {
            filters.to = null;
        }

        // filters.void_privilege = 0;

        let data: object = {
            'export': customers,
            'branch_id': filters.branch_id,
            'sort': filters.sort,
            'order': filters.order,
            'void_privilege': filters.void_privilege,
            'role': filters.role,
            'code': filters.code,
            'sold_from': filters.from,
            'sold_to': filters.to,
            'limit': 'none'
        };

        console.log('the data before exporting', data);

        return this.httpService.post(requestUrl, data)
            .map(
                (response: Response) => response.json()
            );

    }

    exportSalesData(sales, filters?: any) {

        let basePath: string = 'api/transactions';

        const requestUrl = basePath + '/export';

        console.log('filters object', filters);

        let data: object = {
            'export': sales,
            'from': filters.from,
            'to': filters.to,
            'branch_id': filters.branch_id,
            'staff_id': filters.staff_id,
            'transaction_type': filters.transaction_type,
            'sort': filters.sort,
            'order': filters.order,
            'code': filters.code,
            'group': filters.group,
            'source': 'export'
        };

        console.log('the data before exporting', data);

        return this.httpService.post(requestUrl, data)
            .map(
                (response: Response) => response.json()
            );

    }

    exportAdjustmentsData(adjustments, filters?: any) {

        let basePath: string = 'api/transactions';

        const requestUrl = basePath + '/export';

        console.log('filters object', filters);

        let data: object = {
            'export': adjustments,
            'from': filters.from,
            'to': filters.to,
            'branch_id': filters.branch_id,
            'staff_id': filters.staff_id,
            'transaction_type': filters.transaction_type,
            'sort': filters.sort,
            'order': filters.order,
            'code': filters.code,
            'group': filters.group
        };

        console.log('the data before exporting', data);

        return this.httpService.post(requestUrl, data)
            .map(
                (response: Response) => response.json()
            );
    }

    exportProductsData(products, filters?: any) {

        let basePath: string = 'api/products';

        const requestUrl = basePath + '/export';

        if(!filters.branch_id || filters.branch_id == 'null') {
            filters.branch_id = 0;
        }

        let data: object = {
            'export': products,
            'branch_id': filters.branch_id,
            'sort': filters.sort,
            'order': filters.order,
            'code': filters.code,
            'from': filters.from,
            'to': filters.to
        }

        if(filters.code != 'stocks') {
            let data: object = {
                'export': products,
                'category_id': filters.category_id,
                'variation_id': filters.variation_id,
                'sort': filters.sort,
                'order': filters.order,
                'code': filters.code
            }
        }
        console.log('===== the data before exporting products data', data);


        return this.httpService.post(requestUrl, data)
            .map(
                (response: Response) => response.json()
            );
    }

    exportPricingData(pricing, filters?: any) {

        let basePath: string = 'api/pricing';

        const requestUrl = basePath + '/export';

        let data: object = {
            'export': 'pricing',
            'variation_id': filters.variation_id,
            'rule_type': filters.rule_type,
            'discount_type': filters.discount_type,
            'customer_type': filters.customer_type,
            'sort': filters.sort,
            'order': filters.order,
            'code': filters.code
        }

        return this.httpService.post(requestUrl, data)
            .map(
                (response: Response) => response.json()
            );
    }

    exportCategoriesData(categories, filters? :any) {

        let basePath: string = 'api/products/categories';

        const requestUrl = basePath + '/export';

        let data: object = {
            'export': categories,
            'order': filters.order,
            'code': filters.code
        }

        return this.httpService.post(requestUrl, data)
            .map(
                (response: Response) => response.json()
            );
    }

    exportReportsData(exportData: any, reportType: string, filters?: any,  selectedBranch?: number, branches?: any) {

        let basePath: string = 'api/transactions';

        const requestUrl = basePath + '/export';

        if (filters.from == 'null--') {
            filters.from = null;
        }

        if (filters.to == 'null--') {
            filters.to = null;
        }

        let data: object = {
            export: exportData,
            branchId: selectedBranch,
            branches: branches,
            code: 'reports',
            reportType: reportType,
            from: filters.from,
            to: filters.to
        };

        return this.httpService.post(requestUrl, data)
            .map(
                (response: Response) => response.json()
            );

    }

    exportDeliveriesData(deliveryItems: any, totalDeliveryItems: any, deliveryDetails: any) {

        let requestUrl: string = 'api/deliveries/export';

        let data: object = {
            export: deliveryItems,
            remarks: deliveryDetails.remarks,
            status: deliveryDetails.status,
            total: totalDeliveryItems,
            branch: deliveryDetails.branch,
            date: deliveryDetails.date,
            code: 'deliveries'
        }

        return this.httpService.post(requestUrl, data)
            .map(
                (response: Response) => response.json()
            );
    }

}
