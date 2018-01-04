import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

import {
    SearchService,
    AlertService,
    ModalService,
    AuthService,
    RoleService,
    UserService
} from "../../../shared";

import {
    User
} from '../../../classes';

import {
    AddStaffModalComponent,
    EditStaffModalComponent,
    ExportStaffModalComponent
} from '../../modals';

@Component({
    selector: 'app-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss']
})

export class StaffComponent implements OnInit {

    title: string = 'STAFF';

    description: string = 'List of all registered staff';

    sub: Subscription;
    staff: User[] = [];

    currentPage: number = 1;
    query: string = "";
    limit: number;
    maxLength: number;
    currentLength: number;
    private searchSubscription: any;

    dataLoaded: boolean = true;

    filter: {
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

    constructor(
        public router: Router,
        private authService: AuthService,
        private activeRoute: ActivatedRoute,
        private modalService: ModalService,
        private roleService: RoleService,
        private userService: UserService,
        private alertService: AlertService,
        private searchService: SearchService
    ) { }


    ngOnInit() {

        this.searchService.isOn.emit(true);

        this.sub = this.activeRoute.params.subscribe(params => {

            // TODO: refactor into a reusable function

            const isLoggedIn = this.authService.isLoggedIn();

            if (!isLoggedIn) {
                this.authService.showModal.emit(true);
            }

            if (isLoggedIn) {
                console.log('route changed');
                this.getStaff();
            }

        });

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {
                console.log('test');
                this.query = query;
                this.getStaff();
            },
            (error) => console.log('search error', error)
        );
    }

    openAddStaffModal() {

        const modalRef = this.modalService.open(AddStaffModalComponent);

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStaff();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    getStaff() {

        this.dataLoaded = false;

        const currentPage = this.currentPage;
        const limit = this.limit;
        const query = this.query;

        this.roleService.getStaffRoles(currentPage, query, limit)
            .subscribe(
                (response) => {
                    console.log("get staff response", response.data);
                    this.staff = response.data;
                    console.log('staff length', this.staff.length);
                    this.limit = response.limit;
                    this.currentLength = response.data.length;
                    this.maxLength = response.length;
                    this.dataLoaded = true;
                },
                (error: Response) => {
                    console.log('An error occurred while retrieving all staff data', error);
                    this.dataLoaded = true;
                }
            )

    }

    onEdit(staff: User) {
        this.openEditStaffModal(staff)
    }

    openEditStaffModal(staff: User) {

        console.log('edited staff: ', staff);

        const modalRef = this.modalService.open(EditStaffModalComponent, {
            size: 'lg'
        });

        modalRef.componentInstance.staff = staff;
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStaff();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onDelete(id: number) {

        this.alertService.confirm("Delete Staff?")
            .then(()=>{
                this.deleteStaff(id);
            })
            .catch(()=>{});

    }

    deleteStaff(id:number) {

        this.userService.deleteUser(id)
            .subscribe(
                (data) => {
                    this.onStaffDeleted(id);
                    this.alertService.notifySuccess("Staff successfully deleted");
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onStaffDeleted(id:number) {

        console.log('deleted staff id number: ', id);

        const position = this.staff.findIndex(
            (staff: User) => {
                return staff.id == id;
            }
        );

        console.log('position of the staff to be deleted: ', position);

        this.staff.splice(position, 1);
    }

    setVoidPrivilege(privilege) {
        if(privilege == 0) {
            return 'No';
        }
        return 'Yes';
    }

    selectPage(page: number) {
        this.currentPage = page;
        this.getStaff();
    }

    openExportModal(staff: User[]) {

        const modalRef = this.modalService.open(ExportStaffModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop:'static'
        });

        modalRef.componentInstance.staff = staff;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStaff();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }
}
