import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Product} from "../../../../classes/product.class";
import {TransactionService} from "../../../../shared/services/api/transaction.service";
import {Branch} from "../../../../classes/branch.class";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'app-ledger-modal',
    templateUrl: './ledger-modal.component.html',
    styleUrls: ['./ledger-modal.component.css']
})
export class LedgerModalComponent implements OnInit {

    @Input() currentBranchId: number = null;
    @Input() product: Product = new Product();
    @Input() branches: Branch[] = [];

    ledgerType: string = 'warehouse';
    ledgers: any[] = [];
    currentProductVariationId: number = null;

    dateFrom: {
        year: number,
        month: number,
        day: number
    };
    dateTo:{
        year: number,
        month: number,
        day: number
    };
    orderBy:string = "desc";

    ledgerMaxLength: number;
    ledgerCurrentLength:number;
    ledgerLimit:number;
    ledgerCurrentPage:number = 1;

    loadingData:boolean = false;

    constructor(public activeModal: NgbActiveModal,
                private transactionService: TransactionService,
                private parserFormatter: NgbDateParserFormatter) {



    }

    ngOnInit() {

        console.log('this product: ', this.product);
        this.currentProductVariationId = this.product.id;

        if(isNaN(this.currentBranchId)){
            this.currentBranchId = null;
        }

        this.getLedgerByType();

    }

    getLedgerByType(resetBranch:boolean = false) {

        const productVariationId = this.currentProductVariationId;
        let currentBranchId = this.currentBranchId;
        const ledgerType = this.ledgerType;



        if(resetBranch){
            this.currentBranchId = null;
            currentBranchId = this.currentBranchId;
        }

        this.ledgers = [];

        if(ledgerType == 'branch' && currentBranchId == null){
            return false;
        }

        if(currentBranchId){
            this.ledgerType = 'branch';
        }

        this.loadingData = true;

        const page = this.ledgerCurrentPage;
        const order = this.orderBy;

        console.log('from: ', this.dateFrom);
        console.log('to: ', this.dateTo);

        let from = this.parserFormatter.format(this.dateFrom);
        let to = this.parserFormatter.format(this.dateTo);

        if (from == 'null--') {
            from = null;
        }

        if (to == 'null--') {
            to = null;
        }

        this.transactionService.getItemBranchLedger(productVariationId, currentBranchId, page, order, from, to)
            .subscribe(
                (response) => {

                    console.log('ledger response: ', response);

                    this.ledgers = response.data;
                    this.ledgerLimit = response.limit;
                    this.ledgerCurrentLength = response.data.length;
                    this.ledgerMaxLength = response.length;
                    this.loadingData = false;
                },
                (error) => {
                    console.log('error fetching ledger: ', error);
                }
            );

    }

    selectPage(page: number) {
        this.ledgerCurrentPage = page;
        this.getLedgerByType();
    }

}
