import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    PricingService,
    AlertService,
    ExportService,
    ProductService
} from "../../../../shared/services";

import {
    ProductVariation,
    ErrorResponse
} from "../../../../classes";

@Component({
    selector: 'app-export-pricing-modal',
    templateUrl: './export-pricing-modal.component.html',
    styleUrls: ['./export-pricing-modal.component.css']
})

export class ExportPricingModalComponent implements OnInit {

    // modal headings
    title: string = 'EXPORT PRICING DATA';
    description: string = 'Download pricing data as an Excel file';

    @Input() pricing;
    spreadSheetUrl: string;

    // filters
    filters: {
        variation_id:string,
        rule_type:string,
        discount_type:string,
        customer_type:string,
        sort:string,
        order:string,
        code:string
    } = {
        'variation_id': '',
        'rule_type': '',
        'discount_type': '',
        'customer_type': '',
        'sort': '',
        'order': '',
        'code': 'pricing'
    };

    // array lists
    sortOptionsList: any = [
        {
            'value': 'name',
            'label': 'Rule Name'
        },
        {
            'value': 'product_name',
            'label': 'Product Name'
        },
        {
            'value': 'type',
            'label': 'Rule Type'
        },
        {
            'value': 'discount_type',
            'label': 'Discount Type'
        },
        {
            'value': 'apply_to',
            'label': 'Customers'
        }
    ];
    orderOptionsList: {
        value: string,
        label: string
    }[] = [
        {
            'value': 'ASC',
            'label': 'ASCENDING'
        },
        {
            'value': 'DESC',
            'label': 'DESCENDING'
        }
    ];
    ruleTypeList: any = [
        { code: 'simple-discount', label: 'Simple Discount'},
        { code: 'spend-x-get-discount', label: 'Spend X To Get A Discount' },
        { code: 'buy-x-get-discount', label: 'Buy X To Get A Discount' },
    ];
    discountTypeList: any = [
        {'value': 'fixed', 'label': 'Fixed Price'},
        {'value': 'percent', 'label': 'Percent Discount'}
    ];
    customerTypeList: any = [
        {
            'value': 'all',
            'label': 'All Customers'
        },
        {
            'value': 'member',
            'label': 'Members Only',
        },
        {
            'value': 'guest',
            'label':  'Guest Only'
        }
    ];
    productList: ProductVariation[] = [];

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private exportService: ExportService,
        private productService: ProductService,
        private pricingService: PricingService
    ) {}

    ngOnInit() {
        this.getProducts();
    }

    getProducts() {

        let currentPage;

        this.productService.getAllProductVariations(currentPage)
            .subscribe(
                (response) => {
                    console.log('productList', response.data);
                    this.productList = response.data;
                },
                (error: Response) => {
                    console.log(error);
                }
            )
    }

    onExport(filters?: any) {

        console.log('filters', filters);

        const pricing = this.pricing;

        console.log('price rules', pricing);

        this.exportService.exportPricingData(pricing, filters)
            .subscribe(
                (response) => {

                    this.spreadSheetUrl = response.data;

                    window.location.href = this.spreadSheetUrl;

                    console.log('Download link', this.spreadSheetUrl);

                },
                (error: Response) => {
                    console.log('An error occurred while exporting the customer data', error);
                }
            )

    }

}