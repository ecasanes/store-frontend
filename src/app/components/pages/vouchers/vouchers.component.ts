import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {ModalService} from "../../../shared/services/helpers/modal.service";
import {AddSellerModalComponent} from "../../modals/add/add-seller-modal/add-seller-modal.component";
import {AddVoucherModalComponent} from "../../modals/add/add-voucher-modal/add-voucher-modal.component";
import {EditVoucherModalComponent} from "../../modals/edit/edit-voucher-modal/edit-voucher-modal.component";
import {ProductService} from "../../../shared/services/api/product.service";
import {Voucher} from "../../../classes/voucher.class";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-vouchers',
    templateUrl: './vouchers.component.html',
    styleUrls: ['./vouchers.component.css']
})
export class VouchersComponent implements OnInit {

    vouchers: Voucher[] = [];

    constructor(private productService: ProductService,
                private modalService: ModalService,
                private parserFormatter: NgbDateParserFormatter
    ) {
    }

    ngOnInit() {
        this.getAllVouchers();
    }

    getAllVouchers() {

        this.productService.getAllVouchers()
            .subscribe(
                (response) => {
                    this.vouchers = response;
                    console.log('vouchers', response);
                },
                (error) => {
                    console.log('something went wrong while fetching sellers: ', error);
                }
            )

    }

    onCreate() {

        const modalConfig = {
            size: 'lg'
        };

        const modalRef = this.modalService.open(AddVoucherModalComponent);

        modalRef.result
            .then(
                (results) => {
                    console.log('modal dismissed');
                    this.getAllVouchers();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onEdit(voucher: Voucher) {

        const editedVoucher = new Voucher();
        editedVoucher.setNew(voucher);

        const modalConfig = {
            size: 'lg'
        };

        const modalRef = this.modalService.open(EditVoucherModalComponent);

        editedVoucher.start = this.parserFormatter.parse(editedVoucher.start);
        editedVoucher.end = this.parserFormatter.parse(editedVoucher.end);

        modalRef.componentInstance.voucher = editedVoucher;

        modalRef.result
            .then(
                (results) => {
                    console.log('modal dismissed');
                    this.getAllVouchers();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onDelete(voucherId: number) {

        this.productService.deleteVoucher(voucherId)
            .subscribe(
                (response) => {
                    this.getAllVouchers();
                },
                (error) => {
                    console.log('something went wrong while deleting single voucher: ', error);
                }
            )

    }

}
