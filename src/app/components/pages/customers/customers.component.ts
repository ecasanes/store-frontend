import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

import {
    AddCustomerModalComponent,
    EditCustomerModalComponent,
    ExportCustomerModalComponent
} from '../../modals'

import {
    ModalService,
    RoleService,
    UserService,
    AlertService,
    AuthService,
    SearchService,
    BranchService
} from '../../../shared';

import {
    User,
    Branch
} from '../../../classes';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

    title:string = 'CUSTOMERS';

    description: string = 'List of all registered customers';

    customers: User[] = [];

    customer: User[];
    branchList: Branch[];
    branchId: number = null;

    customerLoaded:boolean = true;

    sub: Subscription;
    currentPage: number = 1;
    query: string = "";
    limit: number;
    maxLength: number;
    currentLength: number;
    private searchSubscription: any;

    constructor(
        public router: Router,
        private modalService: ModalService,
        private roleService: RoleService,
        private userService: UserService,
        private alertService: AlertService,
        private authService: AuthService,
        private activeRoute: ActivatedRoute,
        private searchService: SearchService,
        private branchService: BranchService
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
                this.branchId = +params['branch_id'];
                this.getAllCustomers();
                this.getAllBranches();
            }

        });

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {
                console.log('test');
                this.query = query;
                this.getAllCustomers();
            },
            (error) => console.log('search error', error)
        );
    }

    openAddCustomersModal() {

        const modalRef = this.modalService.open(AddCustomerModalComponent);

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllCustomers();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openExportCustomersModal(customers: User[]) {

        const modalRef = this.modalService.open(ExportCustomerModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop:'static'
        });

        modalRef.componentInstance.customers = customers;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllCustomers();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    getAllCustomers() {

        this.customerLoaded = false;

        const currentPage = this.currentPage;

        const query = this.query;

        const limit = this.limit;

        const branchId = this.branchId;

        this.roleService.getMemberRoles(currentPage, query, limit, branchId)
            .subscribe(
                (response) => {
                    console.log("get members response", response.data);
                    this.customers = response.data;
                    this.limit = response.limit;
                    this.currentLength = response.data.length;
                    this.maxLength = response.length;
                    this.customerLoaded = true;
                },
                (error: Response) => {
                    this.customerLoaded = true;
                    console.log('An error occurred while retrieving all customer data', error);
                }
            )
    }

    getAllBranches() {

        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branchList = response.data;
                },
                (error: Response) => {
                    console.log('An error occurred while retrieving all branch data', error);
                }
            )
    }

    selectPage(page: number) {
        this.currentPage = page;
        this.getAllCustomers();
    }

    onEdit(customer: User) {
        this.openEditCustomerModal(customer);
    }

    openEditCustomerModal(customer: User) {

        customer.branch_id = customer.branch_id_registered;

        console.log('the customer being edited', customer);

        const modalRef = this.modalService.open(EditCustomerModalComponent);

        modalRef.componentInstance.customer = customer;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllCustomers();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onDelete(id: number) {

        this.alertService.confirm("Delete Customer?")
            .then(()=>{
                this.deleteCustomer(id);
            })
            .catch(()=>{});
    }

    deleteCustomer(id: number) {
        this.userService.deleteUser(id)
            .subscribe(
                (data) => {
                    this.onCustomerDeleted(id);
                    this.alertService.notifySuccess("Customer successfully deleted");
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onCustomerDeleted(id: number) {
        console.log('deleted customer id number: ', id);
        const position = this.customers.findIndex(
            (customer: User) => {
                return customer.id == id;
            }
        );

        console.log('position of the customer to be deleted: ', position);

        this.customers.splice(position, 1);
    }
}
