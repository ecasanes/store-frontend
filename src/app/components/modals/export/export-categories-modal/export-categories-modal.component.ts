import {Input, OnInit, Component} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CategoryService, ExportService, AlertService} from "../../../../shared/services";
import {ErrorResponse} from "../../../../classes";

@Component({
    selector: 'app-export-categories-modal',
    templateUrl: './export-categories-modal.component.html',
    styleUrls:['./export-categories-modal.component.css']
})

export class ExportCategoriesModalComponent implements OnInit {

    @Input() categories;

    title = 'EXPORT CATEGORIES';
    description = 'Download categories data as an Excel file';

    filters: any = {
        'order': '',
        'code': 'categories'
    };

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

    spreadSheetUrl: string = '';

    errorResponse: ErrorResponse = new ErrorResponse();
    constructor(
       public activeModal: NgbActiveModal,
       private exportService: ExportService,
       private alertService: AlertService
    ) {}

    ngOnInit() {

    }

    onExport(filters?: any) {

        const categories = this.categories;

        this.exportService.exportCategoriesData(categories, filters)
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
