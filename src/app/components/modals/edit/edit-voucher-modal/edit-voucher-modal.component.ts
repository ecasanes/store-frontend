import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../classes/user.class";
import {NgbActiveModal, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {ErrorResponseService} from "../../../../shared/services/helpers/error-response.service";
import {UserService} from "../../../../shared/services/api/user.service";
import {ErrorResponse} from "../../../../classes/error-response.class";
import {Voucher} from "../../../../classes/voucher.class";
import {ProductService} from "../../../../shared/services/api/product.service";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";

@Component({
    selector: 'app-edit-voucher-modal',
    templateUrl: './edit-voucher-modal.component.html',
    styleUrls: ['./edit-voucher-modal.component.css']
})
export class EditVoucherModalComponent implements OnInit {

    @Input() voucher: Voucher = new Voucher();
    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(public activeModal: NgbActiveModal,
                private errorResponseService: ErrorResponseService,
                private productService: ProductService,
                private parserFormatter: NgbDateParserFormatter) {

    }

    ngOnInit() {

    }

    onSave() {

        this.voucher.start = this.parserFormatter.format(this.voucher.start);
        this.voucher.end = this.parserFormatter.format(this.voucher.end);

        this.productService.updateVoucher(this.voucher)
            .subscribe(
                (response) => {
                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    this.errorResponse = this.errorResponseService.handleError(error);
                }
            )
    }

}
