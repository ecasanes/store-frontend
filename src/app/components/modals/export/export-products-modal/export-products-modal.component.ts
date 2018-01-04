import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

import {
    AlertService,
    ExportService,
    ProductService,
    CategoryService
} from '../../../../shared/services';

import {
    Product,
    ProductCategory,
    ProductVariation,
    ErrorResponse
} from '../../../../classes';

@Component({
    selector: 'app-export-products-modal',
    templateUrl: './export-products-modal.component.html',
    styleUrls: ['./export-products-modal.component.css']
})
export class ExportProductsModalComponent implements OnInit {

    @Input() products;

    title: string = 'Export Products Data';

    description: string = 'Download your products data as an Excel file';

    errorResponse: ErrorResponse = new ErrorResponse();

    productList: Product[];
    categoryList: ProductCategory[];

    sortOptionsList: any = [
        {
            'value': 'name',
            'label': 'Product Name'
        },
        {
            'value': 'selling_price',
            'label': 'Selling Price'
        },
        {
            'value': 'cost_price',
            'label': 'Cost Price'
        }
    ];

    orderOptionsList: any = [
        {
            'value': 'ASC',
            'label': 'ASCENDING'
        },
        {
            'value': 'DESC',
            'label': 'DESCENDING'
        }
    ];

    spreadSheetUrl: string;

    filters: any = {
        'from': '',
        'to': '',
        'category_id': '',
        'variation_id': '',
        'sort': '',
        'order': '',
        'code': 'products',
    };

    categoryId: number = null;

    query: string = "";
    maxLength: number;
    limit: number;
    currentPage: number = 1;

    loadingData: boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        private parserFormatter: NgbDateParserFormatter,
        private alertService: AlertService,
        private exportService: ExportService,
        private productService: ProductService,
        private categoryService: CategoryService
    ) {

    }

    ngOnInit() {
        console.log('products', this.products);
        this.getProducts();
        this.getCategories();
    }

    getProducts() {

        this.loadingData = true;

        const currentPage = this.currentPage;
        const categoryId = this.categoryId;
        const query = this.query;

        this.productService.getProducts(currentPage, categoryId, query)
            .subscribe(
                (response) => {
                    console.log('productList', response.data);
                    this.productList = response.data;
                    this.loadingData = false;
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }
            )
    }

    getCategories() {

        this.loadingData = true;

        const pageNumber = this.currentPage;

        const query = this.query;

        const limit = this.limit;

        this.categoryService.getCategories(pageNumber, query, limit)
            .subscribe(
                (response) => {

                    console.log('categoryList:', response.data);
                    this.categoryList = response.data;
                    this.loadingData = false;
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log('error in retrieving product categories', error);
                }
            )
    }


    onExport(filters?: any) {

        const products = this.products;

        console.log('filters', filters);

        console.log('products', products);

        this.exportService.exportProductsData(products, filters)
            .subscribe(
                (response) => {
                    console.log('response after export', response);
                    this.spreadSheetUrl = response.data;

                    window.location.href = this.spreadSheetUrl;

                    console.log('Download link', this.spreadSheetUrl);

                },
                (error: Response) => {

                    let errorResponse = error.json();

                    let title = "Unable to export data";

                    let errorMessage = errorResponse['message'];

                    this.alertService.error(title, errorMessage);
                }
            )

    }
}
