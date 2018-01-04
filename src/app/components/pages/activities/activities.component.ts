import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

import {
    ActivityLog,
    ActivityLogType
} from '../../../classes';

import {
    AuthService,
    SearchService,
    ActivityService
} from '../../../shared';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.css']
})

export class ActivitiesComponent implements OnInit {

    title: string = 'Activity Logs';

    description: string = 'List of activities done by all users';

    sub: Subscription;

    activityList: ActivityLog[];

    transactionActivityTypeList: ActivityLogType[];

    transactionActivityTypeId: number = null;

    // search parameters
    currentPage: number = 1;
    query: string = "";
    limit: number;
    maxLength: number;
    currentLength: number;
    private searchSubscription: any;

    activityLogTypes = [
        'inventory_sold_out',
        'inventory_low',
        'notification',
        'void_short_adjustment',
        'shortover_adjustment',
        'short_adjustment'
    ];

    constructor(public router: Router,
                private activeRoute: ActivatedRoute,
                private authService: AuthService,
                private searchService: SearchService,
                private activityService: ActivityService) {
    }

    ngOnInit(): void {

        this.sub = this.activeRoute.params.subscribe(params => {

            // TODO: refactor into a reusable function

            const isLoggedIn = this.authService.isLoggedIn();

            if (!isLoggedIn) {
                this.authService.showModal.emit(true);
            }

            if (isLoggedIn) {

                console.log('route changed');

                this.transactionActivityTypeId = +params['transaction_activity_type_id']

                this.getAll();

                this.getAllTransactionActivityTypes();

            }

        });

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {

                this.query = query;

                this.getAll();

            },
            (error) => console.log('search error', error)
        );

    }

    getAll() {

        const pageNumber = this.currentPage;

        const transactionActivityTypeId = this.transactionActivityTypeId;

        const query = this.query;

        const limit = this.limit;

        this.activityService.getActivities(pageNumber, transactionActivityTypeId, query, limit, null, 'DESC', null, this.activityLogTypes)

            .subscribe(
                (response) => {

                    this.activityList = response.data;

                    this.limit = response.limit;

                    this.currentLength = response.data.length;

                    this.maxLength = response.length;
                },
                (error: Response) => {
                    console.log('error in retrieving activity logs', error);
                }
            )


    }


    getAllTransactionActivityTypes() {

        this.activityService.getTransactionActivityTypes(null, this.activityLogTypes)

            .subscribe(
                (response) => {

                    this.transactionActivityTypeList = response.data;

                },
                (error: Response) => {

                    console.log('error in retrieving transaction activity log types', error);
                }
            )
    }


    selectPage(page: number) {

        this.currentPage = page;

        this.getAll();
    }

}