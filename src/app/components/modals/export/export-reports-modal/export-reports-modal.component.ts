import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

import {
    AlertService,
    ExportService
} from '../../../../shared/services';

import {
    ErrorResponse
} from '../../../../classes';

@Component({
    selector: 'app-export-reports-modal',
    templateUrl: './export-reports-modal.component.html',
    styleUrls: ['./export-reports-modal.component.css']
})
export class ExportReportsModalComponent implements OnInit {

    @Input() generalSummary;

    @Input() salesSummary;

    @Input() topItems;

    @Input() branches;

    @Input() selectedBranch;

    @Input() from;

    @Input() to;

    title: string = 'Export Reports Data';

    description: string = 'Download your reports data as an Excel file';

    errorResponse: ErrorResponse = new ErrorResponse();

    spreadSheetUrl: string;

    loadingData: boolean = false;

    report: any;

    reportOptionsList: any = [
        {id: 1, code: 'general_summary', name: 'General Summary'},
        {id: 2, code: 'sales_summary', name: 'Sales Summary'},
        {id: 3, code: 'top_items', name: 'Top Items'},
    ];

    constructor(
        public activeModal: NgbActiveModal,
        private parserFormatter: NgbDateParserFormatter,
        private alertService: AlertService,
        private exportService: ExportService
    ) {

    }

    ngOnInit() {
        console.log('general summary', this.generalSummary);
        console.log('sales summary', this.salesSummary);
        console.log('top items', this.topItems);
    }

    onExport(reportType) {

        let exportData: any;

        console.log('the report to be exported', reportType);

        const generalSummary = this.generalSummary;
        const salesSummary = this.salesSummary;
        const topItems = this.topItems;
        const branches = this.branches;
        const selectedBranch = this.selectedBranch;



        let filters: any = {
            from: this.parserFormatter.format(this.from),
            to: this.parserFormatter.format(this.to)
        };

        if(reportType == 'general_summary') {
            exportData = generalSummary;
        }

        if(reportType == 'sales_summary') {
            exportData = salesSummary;
        }

        if(reportType == 'top_items') {
            exportData = topItems;
        }

        this.exportService.exportReportsData(exportData, reportType, filters, selectedBranch, branches)
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
