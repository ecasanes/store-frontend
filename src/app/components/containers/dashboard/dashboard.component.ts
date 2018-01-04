import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {
    AuthService,
    CategoryService,
    DashboardEventService,
    SearchService
} from "../../../shared";

import {ProductCategory} from '../../../classes';
import {ActivityService} from "../../../shared/services/api/activity.service";
import {ActivityLog} from "../../../classes/activity-log.class";
import {PusherService} from "../../../shared/services/helpers/pusher.service";
import {Constants} from "../../../shared/constants";
import {AlertService} from "../../../shared/services/helpers/alert.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    [x: string]: any;

    panelTitle: string;
    panelDescription: string;

    hasCompanyPrivileges: boolean = false;
    hasCompanyStaffInventoryPrivileges: boolean = false;
    hasCompanyStaffSalesPrivileges: boolean = false;

    currentNav: string = "";

    categories: ProductCategory[];

    searchKey: string = "";

    notificationActive: boolean = false;
    notificationCount: number = 0;
    notifications: ActivityLog[] = [];

    updateNotificationSubscription: any;
    newToastNotificationSubscription: any;

    notificationEvent: EventEmitter<any> = new EventEmitter<any>();
    toastNotificationEvent: EventEmitter<any> = new EventEmitter<any>();

    searchIsOn: boolean = true;

    constructor(private authService: AuthService,
                private router: Router,
                private categoryService: CategoryService,
                private dashboardEventService: DashboardEventService,
                private searchService: SearchService,
                private activityService: ActivityService,
                private pusherService: PusherService,
                private alertService: AlertService) {

        this.panelTitle = "Dashboard";
        this.panelDescription = "Landing Panel";

        this.searchService.isOn.subscribe((isOn: boolean) => {

            if(!isOn){
                this.searchKey = "";
            }

            this.searchIsOn = isOn;
        });

        this.dashboardEventService.onGetCategories.subscribe(
            (categories) => {
                this.categories = categories;
            },
            (errorRes) => {
                console.log('Error occurred while getting categories from dashboard event service: ', errorRes)
            }
        );

        const notificationEvent = this.notificationEvent;
        const toastEvent = this.toastNotificationEvent;

        this.pusherService.bindDefault(Constants.eventUpdateNotification, function (data) {
            notificationEvent.emit(data);
        });

        this.pusherService.bindDefault(Constants.eventNotificationToast, function (data) {
            toastEvent.emit(data);
        });
    }

    ngOnInit() {

        document.body.classList.remove("login");
        document.body.classList.add("dashboard");

        /*this.router.events.subscribe(
         event => {
         console.log('router events: ', event);
         }
         );*/

        this.getPrivileges();
        this.getCategories();
        this.getNotifications();

        this.updateNotificationSubscription = this.notificationEvent.subscribe(
            (data) => {
                this.getNotifications();
            }
        );

        this.newToastNotificationSubscription = this.toastNotificationEvent.subscribe(
            (data) => {

                const message = data.message;
                const title = data.title;
                const type = data.type;

                this.newToastNotification(message, title, type);
            }
        );

    }

    ngOnDestroy() {
        this.updateNotificationSubscription.unsubscribe();
        this.newToastNotificationSubscription.unsubscribe();
    }

    newToastNotification(message: string, title: string, type: string) {

        this.alertService.notify(message, title, type);

    }

    toggleNotification() {

        if (this.notificationActive) {
            this.notificationActive = false;
            return false;
        }

        this.notificationCount = 0;
        this.notificationActive = true;
        return false;

    }

    setCurrentNav(currentNav) {

        if (this.currentNav === currentNav) {
            this.currentNav = "";
            return false;
        }

        this.currentNav = currentNav

        switch (this.currentNav) {
            case 'dashboard':
                this.router.navigateByUrl('/');
                break;
            case 'products':
                this.router.navigateByUrl('/products');
                break;
            case 'categories':
                this.router.navigateByUrl('/categories');
                break;
            case 'deliveries':
                this.router.navigateByUrl('/deliveries');
                break;
            case 'prices':
                this.router.navigateByUrl('/pricing');
                break;
            case 'stores':
                this.router.navigateByUrl('/stores');
                break;
            case 'staffs':
                this.router.navigateByUrl('/staff');
                break;
            case 'customers':
                this.router.navigateByUrl('/customers');
                break;
            case 'sales':
                this.router.navigateByUrl('/sales');
                break;
            case 'adjustments':
                this.router.navigateByUrl('/adjustments');
                break;
            case 'reports':
                this.router.navigateByUrl('/reports');
                break;
            case 'managers':
                this.router.navigateByUrl('/managers');
                break;
            case 'activities':
                this.router.navigateByUrl('/activities');
                break;
            case 'stocks':
                this.router.navigateByUrl('/stocks');
                break;
            case 'franchisees':
                this.router.navigateByUrl('/franchisees');
                break;

        }
    }

    logout() {
        this.authService.removeToken();
        this.router.navigate(['/signin'])
            .then(function () {
                console.log('logged out');
            })
    }

    getPrivileges() {
        this.hasCompanyPrivileges = this.authService.validateCompanyPrivileges();
        this.hasCompanyStaffInventoryPrivileges = this.authService.validateCompanyStaffPrivileges('inventory');
        this.hasCompanyStaffSalesPrivileges = this.authService.validateCompanyStaffPrivileges('sales');
        //this.hasInventoryPrivileges = this.validateInventoryPriveleges();
    }

    hasNavs(navs: string[]) {

        let hasNav = false;
        const currentNav = this.currentNav;

        navs.forEach(function (nav) {

            if (currentNav == nav) {
                hasNav = true;
            }

        });

        return hasNav;

    }

    getCategories() {
        this.categoryService.getCategories()
            .subscribe(
                (response) => {
                    this.categories = response.data;
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onSearchEnter() {

        const searchKey = this.searchKey;

        this.searchService.updateQuery(searchKey);

    }

    checkSearchKey() {

        const searchKey = this.searchKey;

        if (searchKey == "") {
            this.onSearchEnter();
        }

    }

    getNotifications() {

        const activityLogTypes = [
            'inventory_sold_out',
            'inventory_low',
            'notification',
            'void_short_adjustment',
            'shortover_adjustment',
            'short_adjustment'
        ];

        this.activityService.getLimitedActivities(5, activityLogTypes)
            .subscribe(
                (response) => {
                    this.notifications = response.data;
                    console.log("NOTIFICATIONS: ", this.notifications);
                    const count = this.notifications.length;

                    if (count > 0) {
                        this.notificationCount++;
                    }

                },
                (error) => {
                    console.log('something went wrong while fetching activities');
                }
            )

    }

    onViewAll() {

        this.notificationActive = false;
        this.router.navigateByUrl('/activities');

    }

}
