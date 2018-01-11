import {Component, OnInit} from '@angular/core';
import {User} from "../../../../classes/user.class";
import {NgbActiveModal, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {ErrorResponseService} from "../../../../shared/services/helpers/error-response.service";
import {UserService} from "../../../../shared/services/api/user.service";
import {ErrorResponse} from "../../../../classes/error-response.class";
import {Voucher} from "../../../../classes/voucher.class";
import {ProductService} from "../../../../shared/services/api/product.service";

@Component({
    selector: 'app-add-voucher-modal',
    templateUrl: './add-voucher-modal.component.html',
    styleUrls: ['./add-voucher-modal.component.css']
})
export class AddVoucherModalComponent implements OnInit {

    voucher: Voucher = new Voucher();
    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(public activeModal: NgbActiveModal,
                private errorResponseService: ErrorResponseService,
                private productService: ProductService,
                private parserFormatter: NgbDateParserFormatter
    ) {

    }

    ngOnInit() {
    }

    onAdd() {

        this.voucher.start = this.parserFormatter.format(this.voucher.start);
        this.voucher.end = this.parserFormatter.format(this.voucher.end);

        this.productService.addVoucher(this.voucher)
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
