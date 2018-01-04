import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {
    ModalService,
    UserService,
    RoleService,
    AlertService,
    SearchService,
    AuthService
} from '../../../shared';

import {
    User
} from '../../../classes';

import {
    AddManagersModalComponent,
    EditManagerModalComponent
} from '../../modals';
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-managers',
    templateUrl: './managers.component.html',
    styleUrls: ['./managers.component.css']
})
export class ManagersComponent implements OnInit {

    title: string = 'MANAGERS';

    description: string = 'List of all registered managers';

    sub: Subscription;

    managers: User[] = [];
    manager: User;
    permissions: any;

    currentPage: number = 1;
    query: string = "";
    limit: number;
    maxLength: number;
    currentLength: number;
    private searchSubscription: any;

    dataLoaded: boolean = true;

    constructor(
        public router: Router,
        private modalService: ModalService,
        private activeRoute: ActivatedRoute,
        private roleService: RoleService,
        private userService: UserService,
        private alertService: AlertService,
        private searchService: SearchService,
        private authService: AuthService
    ) {
    }

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
                this.getAllCompanyStaff();
            }

        });

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {
                this.query = query;
                this.getAllCompanyStaff();
            },
            (error) => console.log('search error', error)
        );
    }

    openAddManagersModal() {

        const modalRef = this.modalService.open(AddManagersModalComponent);

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllCompanyStaff();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    getAllCompanyStaff() {

        this.dataLoaded = false;

        const currentPage = this.currentPage;

        const query = this.query;

        const limit = this.limit;

        this.roleService.getCompanyStaffRoles(currentPage, query, limit)
            .subscribe(
                (response) => {
                    console.log('get managers response', response.data);
                    this.managers = response.data;
                    this.limit = response.limit;
                    this.currentLength = response.data.length;
                    this.maxLength = response.length;
                    this.dataLoaded = true;
                },
                (error: Response) => {
                    console.log('error', error);
                    this.dataLoaded = true;
                }
            )
    }

    getPermissions(id: number, manager) {
        this.roleService.getCompanyStaffPermissions(id)
            .subscribe(
                (response) => {
                    console.log('get manager permissions response', response.data);
                    this.permissions = response.data;
                    manager.permissions = this.permissions;
                    this.openEditManagerModal(manager);
                },
                (error: Response) => {

                }
            )

    }

    onEdit(manager: User) {
        this.getPermissions(manager.id, manager)
    }

    openEditManagerModal(manager: User) {
        manager.permissions = this.permissions;
        console.log('the manager being edited', manager);
        const modalRef = this.modalService.open(EditManagerModalComponent);

        modalRef.componentInstance.manager = manager;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllCompanyStaff();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onDelete(id: number) {

        this.alertService.confirm("Delete Company Manager?")
            .then(()=>{
                this.deleteManager(id);
            })
            .catch(()=>{});

    }

    deleteManager(id: number) {
        this.userService.deleteUser(id)
            .subscribe(
                (data) => {
                    this.onManagerDeleted(id);
                    this.alertService.notifySuccess("Company manager successfully deleted");
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onManagerDeleted(id: number) {
        console.log('deleted manager id number: ', id);
        const position = this.managers.findIndex(
            (manager: User) => {
                return manager.id == id;
            }
        );

        console.log('position of the manager to be deleted: ', position);

        this.managers.splice(position, 1);
    }

    selectPage(page: number) {
        this.currentPage = page;
        this.getAllCompanyStaff();
    }

}
