import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

import {
    RoleService,
    AlertService,
    BranchService,
    TransactionService,
    ExportService
} from '../../../../shared/services';

import {
    User,
    Branch,
    Transaction,
    ErrorResponse
} from '../../../../classes';

@Component({
    selector: 'app-export-adjustments-modal',
    templateUrl: './export-adjustments-modal.component.html',
    styleUrls: ['./export-adjustments-modal.component.css']
})
export class ExportAdjustmentsModalComponent implements OnInit {

    @Input() adjustments;

    title: string = 'Export Adjustments Data';

    description: string = 'Download your adjustments data as an Excel file';

    errorResponse: ErrorResponse = new ErrorResponse();

    branchList: Branch[];
    staffList: User[];
    adjustmentTransactionsList: Transaction[];

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

    spreadSheetUrl: string;

    filters: any = {
        'from': '',
        'to': '',
        'branch_id': '',
        'sort': '',
        'order': '',
        'code': 'adjustments',
        'group': 'adjustment'
    };

    constructor(
        public activeModal: NgbActiveModal,
        private parserFormatter: NgbDateParserFormatter,
        private roleService: RoleService,
        private alertService: AlertService,
        private branchService: BranchService,
        private transactionService: TransactionService,
        private exportService: ExportService
    ) {

    }

    ngOnInit() {
        console.log('adjustments list', this.adjustments);
        this.getAllBranches();
        this.getAllStaff();
        this.getAllAdjustmentTransactionTypes();
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

    getAllAdjustmentTransactionTypes() {

        const group = 'adjustment';

        this.transactionService.getTransactionTypesByGroup(group)
            .subscribe(
                (response) => {

                    this.adjustmentTransactionsList = response.data;
                }
            )
    }

    onExport(filters?: any) {

        const adjustments = this.adjustments;

        filters.from = this.parserFormatter.format(filters.from);

        filters.to = this.parserFormatter.format(filters.to);

        console.log('filters', filters);

        console.log('adjustments', adjustments);

        this.exportService.exportAdjustmentsData(adjustments, filters)
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
