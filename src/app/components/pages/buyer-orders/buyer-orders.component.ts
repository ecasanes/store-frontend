import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {ModalService} from "../../../shared/services/helpers/modal.service";
import {AddSellerModalComponent} from "../../modals/add/add-seller-modal/add-seller-modal.component";
import {TransactionService} from "../../../shared/services/api/transaction.service";
import {Order} from "../../../classes/order.class";

@Component({
    selector: 'app-buyer-orders',
    templateUrl: './buyer-orders.component.html',
    styleUrls: ['./buyer-orders.component.scss']
})
export class BuyerOrdersComponent implements OnInit {

    orders: Order[] = [];
    loadingOrders:boolean = false;

    currentBuyerStatus: string = "to_pay";
    hasAction: boolean = false;

    orderHistoryStatusList: any[] = [
        {
            code:'to_pay',
            name: 'To Pay',
            has_action: false
        },
        {
            code:'paid',
            name: 'Paid',
            has_action: false
        },
        {
            code: 'to_ship',
            name:'To Ship',
            has_action: false
        },
        {
            code: 'shipped',
            name:'To Receive',
            has_action: true
        },
        {
            code:'completed',
            name: 'Completed',
            has_action: false
        }
    ];

    constructor(private userService: UserService,
                private modalService: ModalService,
                private transactionService: TransactionService
    ) {
    }

    ngOnInit() {
        const code = this.currentBuyerStatus;
        this.onGetTransactionsByCode({code:code,has_action:false});
    }

    onGetTransactionsByCode(type: any) {

        this.orders = [];
        this.loadingOrders = true;

        this.currentBuyerStatus = type.code;
        this.hasAction = type.has_action;

        switch(this.currentBuyerStatus){
            case 'to_pay':
                this.getToPay();
                break;
            case 'paid':
                this.getPaid();
                break;
            case 'to_ship':
                this.getToShip();
                break;
            case 'shipped':
                this.getShipped();
                break;
            case 'completed':
                this.getCompleted();
                break;
        }



    }

    getToPay() {

        this.transactionService.getCurrentBuyerToPayTransactions()
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

    getPaid() {

        this.transactionService.getCurrentBuyerPaidTransactions()
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

    getToShip() {

        this.transactionService.getCurrentBuyerToShipTransactions()
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

        this.transactionService.getCurrentBuyerOnDeliveryTransactions()
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

        this.transactionService.getCurrentBuyerCompletedTransactions()
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

    onReceive(order: Order) {

        this.transactionService.receiveOrderByTransactionId(order.transaction_id)
            .subscribe(
                (response) => {
                    this.onGetTransactionsByCode(this.orderHistoryStatusList[4]);
                },
                (error) => {
                    console.log('something went wrongwhile receiving order', error);
                }
            )

    }

}
