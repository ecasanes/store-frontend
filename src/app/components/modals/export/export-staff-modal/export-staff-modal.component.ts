import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

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
    selector: 'app-export-staff-modal',
    templateUrl: './export-staff-modal.component.html',
    styleUrls: ['./export-staff-modal.component.css']
})

export class ExportStaffModalComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal,
        public route: Router,
        private branchService: BranchService,
        private exportService: ExportService,
        private parserFormatter: NgbDateParserFormatter
    ) {}

    title: string = 'Export Staff Data';

    description: string = 'Download staff data as an Excel file';

    @Input() staff: User = new User();

    filters: any = {
        'from': '',
        'to': '',
        'branch_id': '',
        'void_privilege': '',
        'sort': '',
        'order': '',
        'code': 'staff',
        'role': 'staff'
    };

    spreadSheetUrl: string;

    branchList: Branch[];
    defaultBranch: any = {
        'id': 0,
        'name': 'All Branches'
    };
    sortOptionsList: any = [
        {
            'value': 'firstname',
            'label': 'Firstname'
        },
        {
            'value': 'lastname',
            'label': 'Lastname'
        },
        {
            'value': 'branch_name',
            'label': 'Branch'
        },
        {
            'value': 'sold_items',
            'label': 'Sold Items'
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

    // voidPrivilegeList: any = [
    //     {'value': 1, 'label': 'With Void Privilege'},
    //     {'value': 0, 'label': 'Without Void Privilege'}
    // ];

    errorResponse: ErrorResponse = new ErrorResponse();

    ngOnInit() {
        this.getAllBranches();
    }

    onExport(filters?: any) {

        const staff = this.staff;

        console.log('staff', this.staff);

        filters.from = this.parserFormatter.format(filters.from);

        filters.to = this.parserFormatter.format(filters.to);

        console.log('filters', filters);

        this.exportService.exportUserData(staff, filters)
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

                    this.branchList.forEach(function(branch, key, branchListArray) {
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

