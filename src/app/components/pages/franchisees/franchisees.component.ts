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
import {Constants} from "../../../shared/constants";

@Component({
    selector: 'app-franchisees',
    templateUrl: './franchisees.component.html',
    styleUrls: ['./franchisees.component.scss']
})
export class FranchiseesComponent implements OnInit {

    panelTitle: string = "Franchisee Dashboard";
    panelDescription: string = "Overview per franchisee";

    branchList: Branch[];

    // search parameters
    currentPage: number = 1;
    query: string = "";
    limit: number;
    maxLength: number;

    branchTransactions: number = null;

    branchId: number;

    totalSalesPerDay: number = 0;
    totalSalesPerMonth: number = 0;
    totalSalesPerYear: number = 0;
    memberCountPerMonth: number = 0;
    memberCountPerYear: number = 0;

    productsSalesSummary: any[] = [];


    loadingOverview: boolean = false;

    loadingTotalSalesPerDay: boolean = false;
    loadingTotalSalesPerMonth: boolean = false;
    loadingTotalSalesPerYear: boolean = false;
    loadingUserCountPerMonth: boolean = false;
    loadingUserCountPerYear: boolean = false;

    loadingProductsSalesSummary: boolean = false;


    constructor(private branchService: BranchService,
                private transactionService: TransactionService,
                private userService: UserService,
                private searchService: SearchService) {
    }

    ngOnInit() {

        this.searchService.isOn.emit(false);

        this.getAllFranchiseeBranches();
    }

    getOverview(branchId: number) {

        if(!branchId){
            return false;
        }

        this.loadingOverview = true;

        this.getTotalSalesPerDay(branchId);
        this.getTotalSalesPerMonth(branchId);
        this.getTotalSalesPerYear(branchId);
        this.getUserCountPerMonth(branchId);
        this.getUserCountPerYear(branchId);
    }

    checkOverviewLoadingState() {

        if (this.loadingTotalSalesPerDay) {
            return false;
        }

        if (this.loadingTotalSalesPerMonth) {
            return false;
        }

        if (this.loadingTotalSalesPerYear) {
            return false;
        }

        if (this.loadingUserCountPerMonth) {
            return false;
        }

        if (this.loadingUserCountPerYear) {
            return false;
        }

        this.loadingOverview = false;

    }

    getReportsByBranch() {

        const branchId = this.branchTransactions;

        if(branchId){
            this.getOverview(branchId);
            this.getProductsSalesSummary(branchId);
        }

        return false;

    }

    getAllFranchiseeBranches() {

        const franchiseeFlag = Constants.franchiseeFlag;

        this.branchService.getBranches(franchiseeFlag)

            .subscribe(
                (response) => {

                    console.log('branch list', response.data);

                    this.branchList = response.data;

                    console.log('the modified branch list', this.branchList);

                },
                (error: Response) =>

                    console.log(error)
            )
    }

    getTotalSalesPerDay(branchId: number) {

        this.loadingTotalSalesPerDay = true;

        const franchiseeSubType = Constants.franchiseeFlag;

        this.transactionService.getTotalSales('day', branchId, franchiseeSubType)
            .subscribe(
                (response) => {
                    this.totalSalesPerDay = response.data;
                    this.loadingTotalSalesPerDay = false;
                    this.checkOverviewLoadingState();
                },
                (error) => {
                    this.loadingTotalSalesPerDay = false;
                    this.checkOverviewLoadingState();
                    console.log('something went wrong while getting alerts');
                }
            );

    }

    getTotalSalesPerMonth(branchId: number) {

        this.loadingTotalSalesPerMonth = true;

        const franchiseeSubType = Constants.franchiseeFlag;

        this.transactionService.getTotalSales('month', branchId, franchiseeSubType)
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

    getTotalSalesPerYear(branchId: number) {

        this.loadingTotalSalesPerYear = true;

        const franchiseeSubType = Constants.franchiseeFlag;

        this.transactionService.getTotalSales('year', branchId, franchiseeSubType)
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

    getUserCountPerMonth(branchId: number) {

        this.loadingUserCountPerMonth = true;

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

    getUserCountPerYear(branchId: number) {

        this.loadingUserCountPerYear = true;

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

    getProductsSalesSummary(branchId: number) {

        if(!branchId){
            return false;
        }

        this.loadingProductsSalesSummary = true;

        const franchiseeSubType = Constants.franchiseeFlag;

        this.transactionService.getProductsSalesSummary(null, null, branchId, 'monthly', 1, franchiseeSubType)
            .subscribe(
                (response) => {
                    this.productsSalesSummary = response.data;
                    this.loadingProductsSalesSummary = false;
                },
                (error) => {
                    this.loadingProductsSalesSummary = false;
                    console.log('something went wrong while fetching sales summary');
                }
            );

    }

}