import {Component, OnDestroy, OnInit} from "@angular/core";
import {Response} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";

import {
    AuthService,
    ProductService,
    SearchService
} from "../../../shared";

import {
    Product,
} from '../../../classes';

/*import {
 AddCategoryModalComponent,
 AddProductModalComponent,
 EditProductModalComponent,
 RestockProductModalComponent,
 ReturnStockProductModalComponent,
 ExportProductsModalComponent
 } from '../../modals';*/

import {Branch} from "../../../classes/branch.class";
import {BranchService} from "../../../shared/services/api/branch.service";
import {ProductVariation} from "../../../classes/product-variation.class";
import {DeliverSingleItemModalComponent} from "../../modals/action/deliver-single-item-modal/deliver-single-item-modal.component";
import {ModalService} from "../../../shared/services/helpers/modal.service";
import {ReturnDeliveredSingleItemComponent} from "../../modals/action/return-delivered-single-item/return-delivered-single-item.component";

import {
    RestockProductModalComponent,
    ReturnStockProductModalComponent,
    ExportStocksModalComponent,
} from '../../modals';
import {LedgerModalComponent} from "../../modals/action/ledger-modal/ledger-modal.component";


@Component({
    selector: 'app-stocks',
    templateUrl: './stocks.component.html',
    styleUrls: ['./stocks.component.css']
})

export class StocksComponent implements OnInit, OnDestroy {

    products: Product[];
    branches: Branch[];

    productsMaxLength: number;
    productsCurrentLength: number;
    productsLimit: number;
    productsCurrentPage: number = 1;

    panelTitle: string = "Stock on Hand";

    branchId: number = null;
    currentBranch: Branch = new Branch();

    private routeSubscription: any;
    private searchSubscription: any;

    hasCompanyPrivileges: boolean = false;

    query: string = "";

    loadingData: boolean = false;

    constructor(public router: Router,
                private authService: AuthService,
                private activeRoute: ActivatedRoute,
                private productService: ProductService,
                private searchService: SearchService,
                private branchService: BranchService,
                private modalService: ModalService) {
        this.getPrivileges();
    }

    ngOnInit() {

        this.searchService.isOn.emit(true);

        this.routeSubscription = this.activeRoute.params.subscribe(params => {

            // TODO: refactor into a reusable function

            const isLoggedIn = this.authService.isLoggedIn();

            if (!isLoggedIn) {
                this.authService.showModal.emit(true);
            }

            if (isLoggedIn) {

                let currentBranchId = +params['branch_id'];

                this.branchId = currentBranchId;
                this.getCurrentBranch(currentBranchId);
                this.getBranches();
                this.getStocks();
            }

        });

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {
                this.query = query;
                this.getStocks();
            },
            (error) => console.log('query error: ', error)
        )
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
        this.searchSubscription.unsubscribe();
    }

    getCurrentBranch(branchId: number) {

        if (!branchId) {
            return false;
        }

        this.branchService.getBranchById(branchId, 1)
            .subscribe(
                (response) => {

                    console.log('branch response: ', response);

                    this.currentBranch = response.data;
                }
            )

    }

    getStocks() {

        this.loadingData = true;

        //const currentPage = this.productsCurrentPage;
        const branchId = this.branchId;
        const query = this.query;

        if (branchId) {
            this.getBranchStocks(branchId, query);
            return false;
        }

        this.getCompanyStocks(query);
    }

    getBranchStocks(branchId: number, query: string = "") {

        this.productService.getStocksByBranch(branchId, query)
            .subscribe(
                (response) => {
                    this.products = response.data;
                    //this.productsLimit = response.limit;
                    this.productsCurrentLength = response.data.length;
                    this.productsMaxLength = response.data.length;
                    this.loadingData = false;
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }
            )

    }

    getCompanyStocks(query: string = "") {

        this.productService.getCompanyStocks(query)
            .subscribe(
                (response) => {
                    this.products = response.data;
                    //this.productsLimit = response.limit;
                    this.productsCurrentLength = response.data.length;
                    this.productsMaxLength = response.data.length;
                    this.loadingData = false;
                },
                (error) => {
                    this.loadingData = false;
                    console.log('error: ', error);
                }
            )

    }

    getBranches() {

        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branches = response.data;
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onDeliverItem(product: ProductVariation) {

        if (this.branchId) {
            this.openDeliverSingleItemModal(product);
            return false;
        }

        this.openAddWarehouseStockModal(product);


    }

    onReturnDeliveredItem(product: ProductVariation) {

        if (this.branchId) {
            this.openReturnSingleItemModal(product);
            return false;
        }

        this.openSubtractWarehouseStockModal(product);


    }

    openDeliverSingleItemModal(product: ProductVariation) {

        const modalRef = this.modalService.open(DeliverSingleItemModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop: 'static',
        });

        modalRef.componentInstance.product = product;
        modalRef.componentInstance.branch = this.currentBranch;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStocks();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    openReturnSingleItemModal(product: ProductVariation) {


        const modalRef = this.modalService.open(ReturnDeliveredSingleItemComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop: 'static',
        });

        modalRef.componentInstance.product = product;
        modalRef.componentInstance.branch = this.currentBranch;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStocks();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )


    }

    openAddWarehouseStockModal(product: ProductVariation) {

        product.quantity = 0;

        const modalRef = this.modalService.open(RestockProductModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop: 'static',
        });

        modalRef.componentInstance.product = product;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStocks();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    openSubtractWarehouseStockModal(product: ProductVariation) {

        product.quantity = 0;

        const modalRef = this.modalService.open(ReturnStockProductModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop: 'static',
        });

        modalRef.componentInstance.product = product;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStocks();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    openExportModal(products: Product[]) {

        const modalRef = this.modalService.open(ExportStocksModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop: 'static'
        });

        modalRef.componentInstance.stocks = products;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStocks();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openLedgerModal(product: any) {

        const modalRef = this.modalService.open(LedgerModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop: 'static',
            size: 'xl' as 'lg',

        });

        const branches = this.branches;

        modalRef.componentInstance.currentBranchId = this.branchId;
        modalRef.componentInstance.product = product;
        modalRef.componentInstance.branches = branches;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getStocks();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    getPrivileges() {
        this.hasCompanyPrivileges = this.authService.validateCompanyPrivileges();
    }

}
