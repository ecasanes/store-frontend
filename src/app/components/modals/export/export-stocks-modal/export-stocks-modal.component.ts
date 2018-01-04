import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

import {
    ExportService,
    BranchService
} from '../../../../shared/services';

import {
    ErrorResponse,
    Branch,
    Product
} from '../../../../classes';

@Component({
    selector: 'app-export-stocks-modal',
    templateUrl: './export-stocks-modal.component.html',
    styleUrls: ['./export-stocks-modal.component.css']
})

export class ExportStocksModalComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal,
        private branchService: BranchService,
        private parserFormatter: NgbDateParserFormatter,
        private exportService: ExportService
    ) {}

    title: string = 'Export Stocks Data';

    description: string = 'Download stocks data as an Excel file';

    @Input() stocks: Product = new Product();

    filters: any = {
        'branch_id': '',
        'sort': '',
        'code': 'stocks',
    };

    spreadSheetUrl: string;

    branchList: Branch[];
    defaultBranch: any = {
        'id': 0,
        'name': 'All Stocks'
    };
    sortOptionsList: any = [
        {
            'value': 'product_name',
            'label': 'Product Name'
        },
        {
            'value': 'current_inventory',
            'label': 'Current Inventory'
        },
        {
            'value': 'total_sold_items',
            'label': 'Total Sold Items'
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

    errorResponse: ErrorResponse = new ErrorResponse();

    ngOnInit() {
        this.getAllBranches();
    }

    onExport(filters?: any) {

        const stocks = this.stocks;

        filters.from = this.parserFormatter.format(filters.from);

        filters.to = this.parserFormatter.format(filters.to);

        console.log('stocks', this.stocks);

        console.log('filters', filters);

        this.exportService.exportProductsData(stocks, filters)
            .subscribe(
                (response) => {

                    this.spreadSheetUrl = response.data;

                    window.location.href = this.spreadSheetUrl;

                    console.log('Download link', this.spreadSheetUrl);

                },
                (error: Response) => {
                    console.log('An error occurred while exporting the stocks data', error);
                }
            )

    }

    getAllBranches() {

        this.branchService.getBranches()
            .subscribe(

                (response) => {

                    this.branchList = response.data;

                    this.branchList.forEach(function(branch, key, branchListArray){
                        if(branch.name == 'dummy' || branch.name == 'DUMMY') {
                            branchListArray.splice(key);
                        }
                    });

                    this.branchList.unshift(this.defaultBranch);

                    console.log('branch list', response.data);
                },
                (error: Response) =>
                    console.log(error)
            )
    }
}

