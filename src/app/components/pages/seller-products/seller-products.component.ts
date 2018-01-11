import {Component, OnInit} from '@angular/core';
import {AddProductModalComponent} from "../../modals/add/add-product-modal/add-product-modal.component";
import {ModalService} from "../../../shared/services/helpers/modal.service";
import {ProductVariation} from "../../../classes/product-variation.class";
import {ProductService} from "../../../shared/services/api/product.service";
import {ProductCategory} from "../../../classes/product-category.class";
import {CategoryService} from "../../../shared/services/api/category.service";
import {AddStockModalComponent} from "../../modals/add/add-stock-modal/add-stock-modal.component";
import {AuthService} from "../../../shared/services/api/auth.service";
import {AlertService} from "../../../shared/services/helpers/alert.service";
import {Product} from "../../../classes/product.class";
import {EditProductModalComponent} from "../../modals/edit/edit-product-modal/edit-product-modal.component";

@Component({
    selector: 'app-seller-products',
    templateUrl: './seller-products.component.html',
    styleUrls: ['./seller-products.component.css']
})
export class SellerProductsComponent implements OnInit {

    storeId:number = null;

    products: ProductVariation[] = [];
    categories: ProductCategory[] = [];

    isAdmin:boolean = false;
    isSeller: boolean = false;

    panelTitle:string = "";

    constructor(private productService: ProductService,
                private modalService: ModalService,
                private authService: AuthService,
                private categoryService: CategoryService,
                private alertService: AlertService
    ) {
        this.isAdmin = this.authService.validateAdminPrivileges();
        this.isSeller = this.authService.validateSellerPrivileges();

        if(this.isAdmin){
            this.panelTitle = "Seller Products"
        }
    }

    ngOnInit(){
        this.storeId = this.authService.getStoreId();
        this.getAllProducts();
        this.getCategories();
    }

    getAllProducts() {

        const storeId = this.storeId;

        this.productService.getAllProducts(storeId)
            .subscribe(
                (response) => {
                    console.log('products: ', response.data);
                    this.products = response.data;
                },
                (error) => {
                    console.log('something went wrong while fetching all products: ', error);
                }
            )

    }

    onCreate() {

        const modalRef = this.modalService.open(AddProductModalComponent);

        modalRef.result
            .then(
                (results) => {
                    console.log('modal dismissed');
                    this.getAllProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onAddStock() {

        const modalRef = this.modalService.open(AddStockModalComponent);
        modalRef.componentInstance.products = this.products;

        modalRef.result
            .then(
                (results) => {
                    console.log('modal dismissed');
                    this.getAllProducts();
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
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onDelete(productId: number) {

        this.alertService.confirmDelete()
            .then(() => {
                this.deleteProduct(productId);
            })
            .catch(() => {
            });

    }

    deleteProduct(id: number) {

        this.productService.deleteProduct(id)
            .subscribe(
                (data) => {
                    this.getAllProducts();
                    this.alertService.notifySuccess("Product successfully deleted");
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onEdit(product) {
        this.openEditProductModal(product);
    }

    openEditProductModal(product: Product) {

        const modalRef = this.modalService.open(EditProductModalComponent);

        modalRef.componentInstance.product = product;
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllProducts();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

}
