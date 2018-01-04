import {Component, OnInit} from '@angular/core';

import {
    ModalService,
    TransactionService,
    Constants,
    AlertService,
    ErrorResponseService,
    SearchService
} from '../../../shared';

import {
    AddSaleTransactionModalComponent,
    ExportAdjustmentsModalComponent
} from '../../modals';

import {
    Transaction,
    ErrorResponse
} from "../../../classes";
import {ViewTransactionModalComponent} from "../../modals/action/view-transaction-modal/view-transaction-modal.component";

@Component({
    selector: 'app-adjustments',
    templateUrl: './adjustments.component.html',
    styleUrls: ['./adjustments.component.css']
})
export class AdjustmentsComponent implements OnInit {

    title: string = 'ADJUSTMENTS';

    description: string = 'List of adjustments';

    adjustmentsCurrentPage: number = 1;
    query = "";

    transactions: Transaction[] = [];
    transactionsLimit: number;
    transactionsCurrentLength: number;
    transactionsMaxLength: number;

    adjustmentShortOverCode: string = Constants.adjustmentShortOverCode;
    adjustmentShortCode: string = Constants.adjustmentShortCode;

    errorResponse: ErrorResponse = new ErrorResponse();

    loadingData: boolean = false;

    private searchSubscription: any;

    constructor(private modalService: ModalService,
                private transactionService: TransactionService,
                private alertService: AlertService,
                private errorService: ErrorResponseService,
                private searchService: SearchService) {
        this.getTransactions();
    }

    ngOnInit() {

        this.searchService.isOn.emit(true);

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {
                console.log('test');
                this.query = query;
                this.getTransactions();
            },
            (error) => console.log('search error', error)
        );
    }

    getTransactions() {

        this.loadingData = true;

        const currentPage = this.adjustmentsCurrentPage;
        const query = this.query;

        this.transactionService.getAdjustmentTransactions(currentPage, query)
            .subscribe(
                (response) => {
                    this.transactions = response.data;
                    this.transactionsLimit = response.limit;
                    this.transactionsCurrentLength = response.data.length;
                    this.transactionsMaxLength = response.length;
                    this.loadingData = false;
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }

            )
    }

    openViewTransactionModal(orNumber: string) {

        const modalRef = this.modalService.open(ViewTransactionModalComponent);

        modalRef.componentInstance.orNo = orNumber;

        modalRef.result
            .then(
                (results) => {
                    //this.getTransactions();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onViewTransaction(transaction: Transaction) {

        const orNumber = transaction.or_no;

        this.openViewTransactionModal(orNumber);

    }

    onVoidTransaction(transaction: Transaction) {

        this.alertService.confirmDelete("Void this transaction?")
            .then(() => {
                this.voidTransaction(transaction.id);
            })
            .catch();

    }

    isTransactionCanBeVoided(transaction: Transaction) {

        if (transaction.transaction_type != Constants.adjustmentShortOverCode && transaction.transaction_type != Constants.adjustmentShortCode) {
            return false;
        }

        if (transaction.status == Constants.voidFlag) {
            return false;
        }

        return true;

    }

    voidTransaction(transactionId: number) {

        this.transactionService.voidTransaction(transactionId)
            .subscribe(
                (response) => {
                    console.log('void response: ', response);
                    this.alertService.notifySuccess('Transaction successfully voided');
                    this.getTransactions();
                },
                (error: Response) => {
                    console.log('error: ', error);
                    this.errorResponse = this.errorService.handleError(error);
                }
            )

    }

    selectPage(page: number) {
        this.adjustmentsCurrentPage = page;
        this.getTransactions();
    }

    openExportModal(adjustments: Transaction[]) {

        const modalRef = this.modalService.open(ExportAdjustmentsModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop:'static',
        });

        modalRef.componentInstance.adjustments = adjustments;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getTransactions();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

}
