import {Component, OnInit} from '@angular/core';
import {TransactionService} from "../../../shared/services/api/transaction.service";
import {BranchService} from "../../../shared/services/api/branch.service";
import {Branch} from "../../../classes/branch.class";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {SearchService} from "../../../shared/services/helpers/search.service";
import {AlertService, ModalService} from "../../../shared/services";
import {ExportReportsModalComponent}  from '../../modals';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

    filter: {
        branchId: number,
        from: {
            year: number,
            month: number,
            day: number
        },
        to: {
            year: number,
            month: number,
            day: number
        }
    } = {
        branchId: null,
        from: {
            year: null,
            month: null,
            day: null
        },
        to: {
            year: null,
            month: null,
            day: null
        }
    };

    branches: Branch[] = [];
    topItems: any[] = [];
    salesSummary: {
        sales: number,
        net_sales: number,
        gross_profit: number,
        cost_of_sales: number
    } = {
        sales: 0,
        net_sales: 0,
        gross_profit: 0,
        cost_of_sales: 0
    };
    productsSalesSummary: any[] = [];

    loadingData: boolean = false;
    loaded: boolean = false;

    loadingProductsSalesSummary: boolean = false;
    loadingTopItems: boolean = false;
    loadingSalesSummary: boolean = false;

    generatedData: boolean = false;
    graphIntervals: any[] = [];

    constructor(private transactionService: TransactionService,
                private branchService: BranchService,
                private parserFormatter: NgbDateParserFormatter,
                private searchService: SearchService,
                private alertService: AlertService,
                private modalService: ModalService) {
    }

    ngOnInit() {
        this.searchService.isOn.emit(false);
        this.getBranches();
    }

    onClickGenerateReport() {

        console.log('FILTER: ', this.filter);
        let from = this.parserFormatter.format(this.filter.from);
        let to = this.parserFormatter.format(this.filter.to);
        const branchId = this.filter.branchId;

        if (from == 'null--') {
            from = null;
        }

        if (to == 'null--') {
            to = null;
        }

        this.startLoading();

        this.getTopItems(from, to, branchId);
        this.getSalesSummary(from, to, branchId);
        this.getProductsSalesSummary(from, to, branchId);
        
    }

    /* LOADING */

    startLoading() {

        this.loaded = false;
        this.loadingData = true;

        this.loadingTopItems = true;
        this.loadingSalesSummary = true;
        this.generatedData = true;

    }

    checkLoadingState() {

        if (this.loadingTopItems) {
            return false;
        }

        if (this.loadingSalesSummary) {
            return false;
        }

        if (this.loadingProductsSalesSummary) {
            return false;
        }

        this.loadingData = false;
        this.loaded = true;

    }


    /* SERVICES */

    getBranches() {

        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branches = response.data;
                },
                (error) => {
                    console.log('something went wrong while fetching branches');
                }
            );

    }

    getTopItems(from: string, to: string, branchId: number = null) {

        this.loadingTopItems = true;

        this.transactionService.getTopSaleItems(from, to, branchId)
            .subscribe(
                (response) => {
                    console.log('RESPONSE TOP ITEMS: ', response.data);
                    this.topItems = [];
                    this.topItems = response.data;
                    this.loadingTopItems = false;
                    this.checkLoadingState();
                },
                (error) => {
                    this.loadingTopItems = false;
                    this.checkLoadingState();
                    console.log('something went wrong while fetching top items');
                }
            );

    }

    getSalesSummary(from: string, to: string, branchId: number = null) {

        this.loadingSalesSummary = true;

        this.transactionService.getSalesSummary(from, to, branchId)
            .subscribe(
                (response) => {
                    this.salesSummary = response.data;
                    this.loadingSalesSummary = false;
                    this.checkLoadingState();
                },
                (error) => {
                    this.loadingSalesSummary = false;
                    this.checkLoadingState();
                    console.log('something went wrong while fetching sales summary');
                }
            );

    }

    getProductsSalesSummary(from: string, to: string, branchId: number = null) {

        this.loadingProductsSalesSummary = true;

        this.transactionService.getProductsSalesSummary(from, to, branchId)
            .subscribe(
                (response) => {
                    this.productsSalesSummary = response.data;
                    this.loadingProductsSalesSummary = false;
                    this.getGraphInterval();
                    this.checkLoadingState();
                },
                (error) => {
                    this.loadingProductsSalesSummary = false;
                    this.checkLoadingState();
                    console.log('something went wrong while fetching sales summary');
                }
            );

    }


    /* GRAPH RELATED */

    getGraphSalesPercentage(sales: number) {

        const totalSales = this.salesSummary.sales;

        return (sales / totalSales) * 100;

    }

    getGraphInterval() {

        let totalSales = Math.round(this.salesSummary.sales);

        const interval = Math.round(totalSales / 5);

        let graphIntervals = [];

        for (let i = 0; i <= 5; i++) {

            if (i == 0) {
                graphIntervals.push(totalSales);
                continue;
            }

            totalSales = totalSales - interval;

            if (totalSales <= 0) {
                totalSales = 0;
            }

            graphIntervals.push(totalSales);
        }

        this.graphIntervals = graphIntervals;

    }

    onOpenExportModal(branchId) {

        if(!this.generatedData) {

            let title: string = 'Whoops!';

            let description: string = 'You need to generate the data first before exporting';

            return this.alertService.error(title, description);
        }

        const topItems = this.topItems;
        const salesSummary = this.salesSummary;
        const productSalesSummary = this.productsSalesSummary;

        const modalRef = this.modalService.open(ExportReportsModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop: 'static'
        });

        modalRef.componentInstance.generalSummary = productSalesSummary;
        modalRef.componentInstance.salesSummary = salesSummary;
        modalRef.componentInstance.topItems = topItems;
        modalRef.componentInstance.branches = this.branches;
        modalRef.componentInstance.selectedBranch = branchId;
        modalRef.componentInstance.from = this.filter.from;
        modalRef.componentInstance.to = this.filter.to;

        modalRef.result
            .then(
                (results) => {
                    console.log('export reports modal closed', results);
                    this.onClickGenerateReport();
                }
            )
            .catch(
                (error) => console.log('error', error)
            );

    }

}
