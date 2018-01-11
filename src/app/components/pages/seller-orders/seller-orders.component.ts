import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {ModalService} from "../../../shared/services/helpers/modal.service";
import {AddSellerModalComponent} from "../../modals/add/add-seller-modal/add-seller-modal.component";
import {TransactionService} from "../../../shared/services/api/transaction.service";
import {Order} from "../../../classes/order.class";

@Component({
    selector: 'app-seller-orders',
    templateUrl: './seller-orders.component.html',
    styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {

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
            code: 'received',
            name: 'Payment Received',
            has_action: false
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
            case 'received':
                this.getReceivedPayment();
                break;
            case 'completed':
                this.getCompleted();
                break;
        }


    }

    getToPay() {

        this.transactionService.getCurrentSellerToPayTransactions()
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

        this.transactionService.getCurrentSellerToShipTransactions()
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

        this.transactionService.getCurrentSellerShippedTransactions()
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

        this.transactionService.getCurrentSellerToReceiveTransactions()
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

    getReceivedPayment() {

        this.transactionService.getCurrentSellerReceivedTransactions()
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

        this.transactionService.getCurrentSellerCompletedTransactions()
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

    onShip(order: Order) {

        this.transactionService.shipOrderByTransactionId(order.transaction_id)
            .subscribe(
                (response) => {
                    this.onGetTransactionsByCode(this.orderHistoryStatusList[2]);
                },
                (error) => {
                    console.log('something went wrongwhile receiving order', error);
                }
            )

    }

    onReceivePayment(order: Order) {

        this.transactionService.receivePaymentByTransactionId(order.transaction_id)
            .subscribe(
                (response) => {
                    this.onGetTransactionsByCode(this.orderHistoryStatusList[3]);
                },
                (error) => {
                    console.log('something went wrongwhile receiving order', error);
                }
            )

    }

}
