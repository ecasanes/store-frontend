import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {ModalService} from "../../../shared/services/helpers/modal.service";
import {AddSellerModalComponent} from "../../modals/add/add-seller-modal/add-seller-modal.component";
import {TransactionService} from "../../../shared/services/api/transaction.service";
import {Order} from "../../../classes/order.class";

@Component({
    selector: 'app-seller-transactions',
    templateUrl: './seller-transactions.component.html',
    styleUrls: ['./seller-transactions.component.scss']
})
export class SellerTransactionsComponent implements OnInit {

    orders: Order[] = [];
    loadingOrders: boolean = false;

    currentBuyerStatus: string = "to_pay";
    hasAction: boolean = false;

    orderHistoryStatusList: any[] = [
        {
            code: 'to_pay',
            name: 'Unpaid',
            has_action: false
        },
        {
            code: 'to_ship',
            name: 'To Ship',
            has_action: true
        },
        {
            code: 'shipped',
            name: 'Shipping',
            has_action: false
        },
        {
            code: 'to_receive_payment',
            name: 'To Receive Payment',
            has_action: true
        },
        {
            code: 'to_be_completed',
            name: 'To be Completed',
            has_action: true
        },
        {
            code: 'completed',
            name: 'Sold',
            has_action: false
        }
    ];

    constructor(private userService: UserService,
                private modalService: ModalService,
                private transactionService: TransactionService) {
    }

    ngOnInit() {
        const code = this.currentBuyerStatus;
        this.onGetTransactionsByCode({code: code, has_action: false});
    }

    onGetTransactionsByCode(type: any) {

        this.orders = [];
        this.loadingOrders = true;

        this.currentBuyerStatus = type.code;
        this.hasAction = type.has_action;

        switch (this.currentBuyerStatus) {
            case 'to_pay':
                this.getToPay();
                break;
            case 'to_ship':
                this.getToShip();
                break;
            case 'shipped':
                this.getShipped();
                break;
            case 'to_receive_payment':
                this.getToReceivePayment();
                break;
            case 'to_be_completed':
                this.getToBeCompleted();
                break;
            case 'completed':
                this.getCompleted();
                break;
        }


    }

    getToPay() {

        this.transactionService.getAllToPayTransactions()
            .subscribe(
                (response) => {
                    console.log(response);
                    this.orders = response;
                    this.loadingOrders = false;
                },
                (error) => {
                    console.log('something went wrong while getting order history by code', error);
                }
            )

    }

    getToShip() {

        this.transactionService.getAllToShipTransactions()
            .subscribe(
                (response) => {
                    this.orders = response;
                    this.loadingOrders = false;
                },
                (error) => {
                    console.log('something went wrong while getting order history by code', error);
                }
            )

    }

    getToReceivePayment() {

        this.transactionService.getAllToBeReceivedTransactions()
            .subscribe(
                (response) => {
                    this.orders = response;
                    this.loadingOrders = false;
                },
                (error) => {
                    console.log('something went wrong while getting order history by code', error);
                }
            )

    }

    getToBeCompleted() {

        this.transactionService.getAllToBeCompletedTransactions()
            .subscribe(
                (response) => {
                    this.orders = response;
                    this.loadingOrders = false;
                },
                (error) => {
                    console.log('something went wrong while getting order history by code', error);
                }
            )

    }

    getShipped() {

        this.transactionService.getAllShippedTransactions()
            .subscribe(
                (response) => {
                    this.orders = response;
                    this.loadingOrders = false;
                },
                (error) => {
                    console.log('something went wrong while getting order history by code', error);
                }
            )

    }

    getCompleted() {

        this.transactionService.getAllCompletedTransactions()
            .subscribe(
                (response) => {
                    this.orders = response;
                    this.loadingOrders = false;
                },
                (error) => {
                    console.log('something went wrong while getting order history by code', error);
                }
            )

    }

    onComplete(order: Order) {

        this.transactionService.completeTransactionById(order.transaction_id)
            .subscribe(
                (response) => {
                    this.onGetTransactionsByCode(this.orderHistoryStatusList[5]);
                },
                (error) => {
                    console.log('something went wrongwhile receiving order', error);
                }
            )

    }

}
