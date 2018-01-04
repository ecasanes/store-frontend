import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    TransactionService
} from "../../../../shared";

import {
    Transaction
} from "../../../../classes";
import {Constants} from "../../../../shared/constants";

@Component({
    selector: 'app-view-transaction-modal',
    templateUrl: './view-transaction-modal.component.html',
    styleUrls: ['./view-transaction-modal.component.css']
})
export class ViewTransactionModalComponent implements OnInit {

    @Input() orNo: string;
    @Input() branchId: number;

    currentTransaction: Transaction = new Transaction();
    currentVat: number = Constants.vat;

    loadingData: boolean = false;

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private transactionService: TransactionService) {
        this.checkSession();
    }

    ngOnInit() {
        this.getTransactionByOr(this.orNo, this.branchId);
    }

    checkSession() {

        this.authService.dismissCurrentModal.subscribe(
            needsAuth => {

                if (needsAuth) {
                    console.log('Session has expired! Modal will  be closed');
                    setTimeout(() => {
                        this.activeModal.dismiss({message: "Session has expired!"});
                    }, 100);
                    //this.authService.showModal.emit(true);
                    this.authService.confirm.emit(true);
                }

            },
            error => {
                console.log('error', error)
            }
        )
    }

    getTransactionByOr(orNo: string, branchId: number) {

        this.loadingData = true;

        this.transactionService.findSaleByOr(orNo, true, branchId)
            .subscribe(
                (response) => {
                    this.setCurrentTransaction(response.data);
                    this.loadingData = false;
                },
                (error) => {
                    this.loadingData = false;
                    console.log('error getting transaction by or: ', error);
                }
            );

    }

    setCurrentTransaction(jsonData: any) {

        console.log('json data: ', jsonData);

        const transaction = new Transaction();
        transaction.id = jsonData.id;
        transaction.created_at = jsonData.created_at;
        transaction.or_no = jsonData.or_no;
        transaction.customer_firstname = jsonData.customer_firstname;
        transaction.customer_lastname = jsonData.customer_lastname;
        transaction.customer_id = jsonData.customer_id;
        transaction.staff_id = jsonData.staff_id;
        transaction.branch_name = jsonData.branch_name;
        transaction.discount = jsonData.discount;
        transaction.setTransactionItems(jsonData.items, jsonData.returns);
        transaction.setReturnItems(jsonData.returns);

        this.currentTransaction = transaction;

        console.log('current transaction: ', this.currentTransaction);

    }

}
