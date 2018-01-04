import {Component, OnInit} from '@angular/core';

import {
    Branch,
    ActivityLog,
    ActivityLogType
} from '../../../classes';

import {
    AuthService,
    BranchService,
    SearchService,
    ActivityService
} from '../../../shared';
import {ProductService} from "../../../shared/services/api/product.service";
import {TransactionService} from "../../../shared/services/api/transaction.service";
import {UserService} from "../../../shared/services/api/user.service";

@Component({
    selector: 'app-dashboard-index',
    templateUrl: './dashboard-index.component.html',
    styleUrls: ['./dashboard-index.component.scss']
})
export class DashboardIndexComponent implements OnInit {

    panelTitle: string = "Dashboard";

    panelDescription: string = "Overview per branch";

    activityList: ActivityLog[];

    transactionActivityTypeList: ActivityLogType[];

    orderList: any = [
        {id: 0, value: 'ASC', label: 'ASCENDING'},
        {id: 1, value: 'DESC', label: 'DESCENDING'}
    ];

    branchList: Branch[];

    // search parameters
    currentPage: number = 1;
    query: string = "";
    limit: number;
    maxLength: number;
    currentLength: number;
    private searchSubscription: any;

    transactionOrder: any = 'ORDER BY';

    branchTransactions: number = null;

    orderBy: string;

    branchId: number;

    alerts: any[] = [];
    totalSalesPerMonth: number = 0;
    totalSalesPerYear: number = 0;
    memberCountPerMonth: number = 0;
    memberCountPerYear: number = 0;

    graphIntervals: any[] = [];
    productsSalesSummary: any[] = [];


    loadingOverview: boolean = false;
    loadingDailySales: boolean = false;
    loadingFeed: boolean = false;
    loadingAlerts: boolean = false;

    loadingTotalSalesPerMonth: boolean = false;
    loadingTotalSalesPerYear:boolean = false;
    loadingUserCountPerMonth: boolean = false;
    loadingUserCountPerYear: boolean = false;


    constructor(private activityService: ActivityService,
                private branchService: BranchService,
                private productService: ProductService,
                private transactionService: TransactionService,
                private userService: UserService,
                private searchService: SearchService) {
    }

    ngOnInit() {

        this.searchService.isOn.emit(false);

        this.getAllBranches();
        this.getAllTransactionActivityTypes();

        this.getOverview();
        this.getAllTransactionActivities();
        this.getAlerts();
        this.getDailySalesSummary();
    }

    getOverview() {

        this.loadingOverview = true;

        this.getTotalSalesPerMonth();
        this.getTotalSalesPerYear();
        this.getUserCountPerMonth();
        this.getUserCountPerYear();
    }

    checkOverviewLoadingState() {

        if(this.loadingTotalSalesPerMonth){
            return false;
        }

        if(this.loadingTotalSalesPerYear){
            return false;
        }

        if(this.loadingUserCountPerMonth){
            return false;
        }

        if(this.loadingUserCountPerYear){
            return false;
        }

        this.loadingOverview = false;

    }

    getAllTransactionActivities() {

        this.loadingFeed = true;

        const pageNumber = this.currentPage;

        // const transactionActivityTypeId = this.transactionActivityTypeId;

        let transactionActivityTypeId = null;

        const isTransaction = 1;

        const query = this.query;

        const limit = 'none';

        let orderBy = this.orderBy;

        let branchId = this.branchId;

        this.activityService.getActivities(pageNumber, transactionActivityTypeId, query, limit, isTransaction, orderBy, branchId)

            .subscribe(
                (response) => {

                    console.log('get all transaction activities response', response);

                    this.activityList = response.data;
                    this.limit = response.limit;
                    this.currentLength = response.data.length;
                    this.maxLength = response.length;

                    this.loadingFeed = false;
                },
                (error: Response) => {
                    this.loadingFeed = false;
                    console.log('error in retrieving activity logs', error);
                }
            )


    }

    getReportsByBranch(branchId) {

        this.branchId = branchId;

        this.getAllTransactionActivities();
        this.getAlerts();
        this.getOverview();
        this.getDailySalesSummary();

    }

    getAllTransactionActivityTypes() {

        this.activityService.getTransactionActivityTypes()

            .subscribe(
                (response) => {

                    console.log('get all transaction activity types list', response);

                    this.transactionActivityTypeList = response.data;

                },
                (error: Response) => {

                    console.log('error in retrieving transaction activity log types', error);
                }
            )
    }

    getAllBranches() {

        this.branchService.getBranches()

            .subscribe(
                (response) => {

                    console.log('branch list', response.data);

                    // let addDefaultBranch: Branch = new Branch();
                    //
                    // addDefaultBranch.name = 'All Branches'
                    // addDefaultBranch.id = 0;

                    this.branchList = response.data;

                    // this.branchList.splice(0, 0, addDefaultBranch);

                    console.log('the modified branch list', this.branchList);

                },
                (error: Response) =>

                    console.log(error)
            )
    }

    reorderTransactions(order) {

        this.orderBy = order;

        this.getAllTransactionActivities();
    }

    getAlerts() {

        this.loadingAlerts = true;

        const branchId = this.branchTransactions;

        this.productService.getAlerts(branchId)
            .subscribe(
                (response) => {
                    this.alerts = response.data;
                    this.loadingAlerts = false;
                },
                (error) => {
                    this.loadingAlerts = false;
                    console.log('something went wrong while getting alerts');
                }
            );

    }

    getTotalSalesPerMonth() {

        this.loadingTotalSalesPerMonth = true;

        const branchId = this.branchTransactions;

        this.transactionService.getTotalSales('month', branchId)
            .subscribe(
                (response) => {
                    this.totalSalesPerMonth = response.data;
                    this.loadingTotalSalesPerMonth = false;
                    this.checkOverviewLoadingState();
                },
                (error) => {
                    this.loadingTotalSalesPerMonth = false;
                    this.checkOverviewLoadingState();
                    console.log('something went wrong while getting alerts');
                }
            );

    }

    getTotalSalesPerYear() {

        this.loadingTotalSalesPerYear = true;

        const branchId = this.branchTransactions;

        this.transactionService.getTotalSales('year', branchId)
            .subscribe(
                (response) => {
                    this.totalSalesPerYear = response.data;
                    this.loadingTotalSalesPerYear = false;
                    this.checkOverviewLoadingState();
                },
                (error) => {
                    this.loadingTotalSalesPerYear = false;
                    this.checkOverviewLoadingState();
                    console.log('something went wrong while getting alerts');
                }
            );

    }

    getUserCountPerMonth() {

        this.loadingUserCountPerMonth = true;

        const branchId = this.branchTransactions;

        this.userService.getUserCount('month', branchId, 'member')
            .subscribe(
                (response) => {
                    this.memberCountPerMonth = response.data;
                    this.loadingUserCountPerMonth = false;
                    this.checkOverviewLoadingState();
                },
                (error) => {
                    this.loadingUserCountPerMonth = false;
                    this.checkOverviewLoadingState();
                    console.log('something went wrong while fetching user count');
                }
            );

    }

    getUserCountPerYear() {

        this.loadingUserCountPerYear = true;

        const branchId = this.branchTransactions;

        this.userService.getUserCount('year', branchId, 'member')
            .subscribe(
                (response) => {
                    this.memberCountPerYear = response.data;
                    this.loadingUserCountPerYear = false;
                    this.checkOverviewLoadingState();
                },
                (error) => {
                    this.loadingUserCountPerYear = false;
                    this.checkOverviewLoadingState();
                    console.log('something went wrong while fetching user count');
                }
            );

    }


    /* GRAPH RELATED */

    getDailySalesSummary() {

        this.loadingDailySales = true;

        const branchId = this.branchTransactions;

        this.transactionService.getDailySalesSummary(null, null, branchId, 'month')
            .subscribe(
                (response) => {
                    console.log("PRODUCTS SALES SUMMARY: ", response.data);
                    this.productsSalesSummary = response.data;
                    this.getGraphInterval();
                    this.loadingDailySales = false;
                },
                (error) => {
                    this.loadingDailySales = false;
                    console.log('something went wrong while fetching sales summary');
                }
            );

    }

    getGraphSalesPercentage(sales: number) {

        let max = this.getHighestSaleValue(this.productsSalesSummary);
        
        const totalSales = max + 5000;

        return (sales / totalSales) * 100;

    }

    getGraphInterval() {

        let max = this.getHighestSaleValue(this.productsSalesSummary);

        let totalSales = max + 5000;

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

    getHighestSaleValue(data){
        let sales = [];
        for (var i = 0; i < data.length; i++) {
            sales.push(data[i].sales);
        }

        return Math.max(...sales);
    }

}