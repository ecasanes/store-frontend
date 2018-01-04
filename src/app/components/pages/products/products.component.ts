import {Component, OnDestroy, OnInit} from "@angular/core";
import {Response} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";

import {
    AlertService,
    AuthService,
    CategoryService,
    DashboardEventService,
    ModalService,
    ProductService,
    SearchService
} from "../../../shared";

import {
    Product,
    ProductCategory
} from '../../../classes';

import {
    AddCategoryModalComponent,
    AddProductModalComponent,
    EditProductModalComponent,
    RestockProductModalComponent,
    ReturnStockProductModalComponent,
    ExportProductsModalComponent
} from '../../modals';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit, OnDestroy {

    products: Product[];
    categories: ProductCategory[];

    productsMaxLength: number;
    productsCurrentLength: number;
    productsLimit: number;
    productsCurrentPage: number = 1;

    panelTitle: string = "Products";
    panelDescription: string = "List of all Products";

    categoryId: number = null;

    private routeSubscription: any;
    private searchSubscription: any;

    query: string = "";

    loadingData: boolean = false;

    constructor(public router: Router,
                private authService: AuthService,
                private activeRoute: ActivatedRoute,
                private productService: ProductService,
                private modalService: ModalService,
                private categoryService: CategoryService,
                private dashboardEventService: DashboardEventService,
                private searchService: SearchService,
                private alertService: AlertService) {

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
                console.log('route changed');
                this.categoryId = +params['category_id'];
                this.getCategories();
                this.getProducts();
            }

        });

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {
                this.query = query;
                this.getProducts();
            },
            (error) => console.log('query error: ', error)
        )
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
        this.searchSubscription.unsubscribe();
    }

    getProducts() {

        this.loadingData = true;

        const currentPage = this.productsCurrentPage;
        const categoryId = this.categoryId;
        const query = this.query;

        this.productService.getProducts(currentPage, categoryId, query)
            .subscribe(
                (response) => {
                    this.products = response.data;
                    this.productsLimit = response.limit;
                    this.productsCurrentLength = response.data.length;
                    this.productsMaxLength = response.length;
                    this.loadingData = false;
                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }
            )
    }

    onProductDeleted(id: number) {

        console.log('deleted product variation id number: ', id);

        const position = this.products.findIndex(
            (product: Product) => {
                return product.id == id;
            }
        );

        console.log('position of item to be deleted: ', position);

        this.products.splice(position, 1);
    }

    onEdit(product: Product) {
        this.openEditProductModal(product);
    }

    onDelete(productVariationId: number) {

        this.alertService.confirmDelete()
            .then(() => {
                this.deleteProduct(productVariationId);
            })
            .catch(() => {
            });

    }

    onRestock(product: Product) {
        this.openRestockProductModal(product);
    }

    onReturnStock(product: Product) {
        this.openReturnStockProductModal(product);
    }

    deleteProduct(id: number) {

        this.productService.deleteProduct(id)
            .subscribe(
                (data) => {
                    this.onProductDeleted(id);
                    this.alertService.notifySuccess("Product successfully deleted");
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    selectPage(page: number) {
        this.productsCurrentPage = page;
        this.getProducts();
    }

    openAddProductModal() {

        const modalRef = this.modalService.open(AddProductModalComponent, {
            size: 'lg'
        });

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openAddCategoryModal() {

        const modalRef = this.modalService.open(AddCategoryModalComponent);

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getCategories();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openEditProductModal(product: Product) {

        console.log('edited product: ', product);

        const modalRef = this.modalService.open(EditProductModalComponent);

        modalRef.componentInstance.product = product;
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    openRestockProductModal(product: Product) {

        const modalRef = this.modalService.open(RestockProductModalComponent);

        modalRef.componentInstance.product = product;
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openReturnStockProductModal(product: Product) {

        const modalRef = this.modalService.open(ReturnStockProductModalComponent);

        modalRef.componentInstance.product = product;
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    getCategories() {

        this.categoryService.getCategories()
            .subscribe(
                (response) => {
                    this.categories = response.data;
                    this.dashboardEventService.onGetCategories.emit(this.categories);
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    openExportModal(products: Product[]) {

        const modalRef = this.modalService.open(ExportProductsModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop: 'static',
        });

        modalRef.componentInstance.products = products;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

}
