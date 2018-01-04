import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

import {
    ExportService,
    BranchService
} from '../../../../shared/services';

import {
    ErrorResponse,
    Branch,
    User
} from '../../../../classes';

@Component({
    selector: 'app-export-customer-modal',
    templateUrl: './export-customer-modal.component.html',
    styleUrls: ['./export-customer-modal.component.css']
})

export class ExportCustomerModalComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal,
        public route: Router,
        private branchService: BranchService,
        private exportService: ExportService
    ) {}

    title: string = 'Export Customers Data';

    description: string = 'Download your customer data as an Excel file';

    @Input() customers: User = new User();

    filters: any = {
        'branch_id': '',
        'sort': '',
        'order': '',
        'code': 'customers',
        'role': 'member'
    };

    spreadSheetUrl: string;

    branchList: Branch[];

    defaultBranch: any = {
        'id': 0,
        'name': 'All Branches'
    };

    sortOptionsList: any = [
        {
            'value': 'customer_id',
            'label': 'Customer ID'
        },
        {
            'value': 'firstname',
            'label': 'Firstname'
        },
        {
            'value': 'lastname',
            'label': 'Lastname'
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
    ]

    errorResponse: ErrorResponse = new ErrorResponse();

    ngOnInit() {
        this.getAllBranches();
    }

    onExport(filters?: any) {

        console.log('filters', filters);

        const customers = this.customers;

        console.log('customers', this.customers);

        this.exportService.exportUserData(customers, filters)
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

}

