import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Response} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";

import {
    ModalService,
    TransactionService,
    Constants,
    AlertService,
    ErrorResponseService,
    PusherService,
    SearchService,
    AuthService,
    BranchService
} from '../../../shared';

import {
    AddSaleTransactionModalComponent,
    ExportSalesModalComponent,
    ViewTransactionModalComponent
} from '../../modals';

import {
    Transaction,
    ErrorResponse,
    Branch
} from "../../../classes";

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit, OnDestroy {

    title: string = 'SALES';

    description: string = 'List of sales';

    transactions: Transaction[] = [];
    transactionsLimit: number;
    transactionsCurrentLength: number;
    transactionsMaxLength: number;

    errorResponse: ErrorResponse = new ErrorResponse();

    loadingData: boolean = false;

    refreshSaleSubscription: any;
    refreshSaleEvent: EventEmitter<any> = new EventEmitter<any>();

    query: string = "";
    maxLength: number;
    currentLength: number;
    limit: number;
    currentPage: number = 1;

    branchList: Branch[] = [];
    branchId: number = null;

    sortOptionsList: any = [
        {
            id: 0,
            'value': 'or_number',
            'label': 'OR Number'
        },
        {
            id: 1,
            value: 'date',
            label: 'Date'
        }
    ];
    orderOptionsList: any = [
        {
            id: 0,
            value: 'ASC',
            label: 'ASCENDING'
        },
        {
            id: 1,
            value: 'DESC',
            label: 'DESCENDING'
        }
    ];

    salesSort: any = 'SORT BY';
    salesOrder: any = 'ORDER BY';

    private routeSubscription: any;
    private searchSubscription: any;

    constructor(
                public router: Router,
                private authService: AuthService,
                private modalService: ModalService,
                private transactionService: TransactionService,
                private activeRoute: ActivatedRoute,
                private alertService: AlertService,
                private errorService: ErrorResponseService,
                private pusherService: PusherService,
                private searchService: SearchService,
                private branchService: BranchService) {

        this.getTransactions();

        const event = this.refreshSaleEvent;

        this.pusherService.bindDefault(Constants.eventRefreshSale, function(data){
            event.emit(data);
        });
    }

    ngOnInit() {

        this.searchService.isOn.emit(true);

        this.routeSubscription = this.activeRoute.params.subscribe(params => {

            // TODO: refactor into a reusable function

            const isLoggedIn = this.authService.isLoggedIn();

            if (!isLoggedIn) {
                this.authService.showModal.emit(true);
            }

            if (isLoggedIn) {
                console.log('route changed');
                this.branchId = +params['branch_id'];
                this.getTransactions();
                this.getBranches();
            }

        });

        this.refreshSaleSubscription = this.refreshSaleEvent.subscribe(
            (data) => {
                this.getTransactions();
            }
        );

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {
                console.log('test');
                this.query = query;
                this.getTransactions();
            },
            (error) => console.log('search error', error)
        );
    }

    ngOnDestroy() {
        this.refreshSaleSubscription.unsubscribe();
    }

    getTransactions() {

        this.loadingData = true;

        const currentPage = this.currentPage;
        const query = this.query;
        const branchId = this.branchId;
        let sort = '';
        let order = '';

        if(this.salesSort != 'SORT BY') {
            sort = this.salesSort;
        }

        if(this.salesOrder != 'ORDER BY') {
            order = this.salesOrder;
        }

        this.transactionService.getSaleTransactions(currentPage, branchId, sort, order, query)
            .subscribe(
                (response) => {
                    console.log('transactions list', response.data);
                    this.transactions = response.data;
                    this.limit = response.limit;
                    this.currentLength = response.data.length;
                    this.maxLength = response.length;
                    this.loadingData = false;
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }
            )
    }

    getBranches() {
        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branchList = response.data;
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onAddTransaction() {
        this.openAddSaleTransactionModal();
    }

    openAddSaleTransactionModal() {

        const modalConfig = {
            size: 'lg'
        };

        const modalRef = this.modalService.open(AddSaleTransactionModalComponent);

        modalRef.result
            .then(
                (results) => {
                    this.getTransactions();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openViewTransactionModal(orNumber: string, branchId: number) {

        const modalRef = this.modalService.open(ViewTransactionModalComponent);

        modalRef.componentInstance.orNo = orNumber;
        modalRef.componentInstance.branchId = branchId;

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
        const branchId = transaction.branch_id;

        this.openViewTransactionModal(orNumber, branchId);

    }

    onVoidTransaction(transaction: Transaction) {

        this.alertService.confirmDelete("Void this transaction?")
            .then(() => {
                this.voidTransaction(transaction.id);
            })
            .catch();

    }

    isTransactionCanBeVoided(transaction: Transaction) {

        if(transaction.transaction_type != Constants.returnSaleCode && transaction.transaction_type != Constants.saleCode){
            return false;
        }

        if(transaction.status == Constants.voidFlag){
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
                    this.errorResponse = this.errorService.handleError(error);
                }
            )

    }

    selectPage(page: number) {
        this.currentPage = page;
        this.getTransactions();
    }

    openExportModal(sales: Transaction[]) {

        const modalRef = this.modalService.open(ExportSalesModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop:'static',
        });

        modalRef.componentInstance.sales = sales;

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

    sortSales(sort) {
        console.log('sort by', sort);

        this.salesSort = sort;

        this.getTransactions();
    }

    reorderSales(order) {

        console.log('order by', order);

        this.salesOrder = order;

        this.getTransactions();
    }

}
