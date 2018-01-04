import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

import {
    TransactionService,
    ExportService,
    RoleService,
    BranchService,
    AlertService
} from '../../../../shared/services';

import {
    ErrorResponse,
    Branch,
    User,
    Transaction
} from '../../../../classes';

@Component({
    selector: 'app-export-sales-modal',
    templateUrl: './export-sales-modal.component.html',
    styleUrls: ['./export-sales-modal.component.css']
})

export class ExportSalesModalComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal,
        private branchService: BranchService,
        private parserFormatter: NgbDateParserFormatter,
        private roleService: RoleService,
        private transactionService: TransactionService,
        private alertService: AlertService,
        private exportService: ExportService
    ) {}

    title: string = 'Export Sales Data';

    description: string = 'Download your sales data as an Excel file';

    @Input() sales: Transaction = new Transaction();

    filters: any = {
        'from': '',
        'to': '',
        'branch_id': '',
        'sort': '',
        'order': '',
        'code': 'sales',
        'group': 'sale'
    };

    spreadSheetUrl: string;

    branchList: Branch[];

    staffList: User[];

    saleTransactionsList: any;

    defaultBranch: any = {
        'id': 0,
        'name': 'All Branches'
    };

    sortOptionsList: any = [
        {
            'value': 'or_number',
            'label': 'OR Number'
        },
        {
            'value': 'date',
            'label': 'Date'
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
        this.getAllSalesTransactionTypes();
        this.getAllBranches();
        this.getAllStaff();
    }

    onExport(filters?: any) {

        const sales = this.sales;

        filters.from = this.parserFormatter.format(filters.from);

        filters.to = this.parserFormatter.format(filters.to);

        console.log('filters', filters);

        console.log('sales', sales);

        this.exportService.exportSalesData(sales, filters)
            .subscribe(
                (response) => {

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

    getAllBranches() {

        this.branchService.getBranches()
            .subscribe(

                (response) => {

                    this.branchList = response.data;

                    this.branchList.unshift(this.defaultBranch);

                    console.log('branch list', response.data);
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    getAllStaff() {

        let pageNumber: number;

        this.roleService.getStaffRoles(pageNumber)
            .subscribe(
                (response) => {
                    console.log("get staff response", response.data);
                    this.staffList = response.data;
                },
                (error: Response) => {

                }
            )
    }

    getAllSalesTransactionTypes() {

        this.transactionService.getSaleTransactionTypes()
            .subscribe(
                (response) => {

                    this.saleTransactionsList = response.data;
                }
            )
    }

}

