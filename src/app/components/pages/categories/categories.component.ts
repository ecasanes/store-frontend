import { Component, OnInit } from '@angular/core';
import {Response} from "@angular/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

import {
    AuthService,
    CategoryService,
    SearchService,
    ModalService,
    AlertService,
} from '../../../shared';

import {
    ProductCategory
} from '../../../classes';

import {
    AddCategoryModalComponent,
    EditCategoryModalComponent,
    ExportCategoriesModalComponent
} from '../../modals';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {

    title: string = 'PRODUCT CATEGORIES';

    description: string = 'List of all product categories';

    sub: Subscription;
    categoryList: ProductCategory[] = [];
    currentPage: number = 1;
    query: string = "";
    limit: number;
    maxLength: number;
    currentLength: number;
    private searchSubscription: any;

    dataLoaded: boolean = true;

    constructor(
        public router: Router,
        private authService: AuthService,
        private activeRoute: ActivatedRoute,
        private categoryService: CategoryService,
        private searchService: SearchService,
        private modalService: ModalService,
        private alertService: AlertService,
    ) {

    }

    ngOnInit(): void {

        this.searchService.isOn.emit(true);

        this.sub = this.activeRoute.params.subscribe(params => {

            // TODO: refactor into a reusable function

            const isLoggedIn = this.authService.isLoggedIn();

            if (!isLoggedIn) {
                this.authService.showModal.emit(true);
            }

            if (isLoggedIn) {

                console.log('route changed');

                this.getAllProductCategories();
            }

        });

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {

                console.log('test');

                this.query = query;

                this.getAllProductCategories();
            },
            (error) => console.log('search error', error)
        );
    }

    getAllProductCategories() {

        this.dataLoaded = false;

        const pageNumber = this.currentPage;

        const query = this.query;

        const limit = this.limit;

        this.categoryService.getCategories(pageNumber, query, limit)
            .subscribe(
                (response) => {

                    console.log('get categories response', response);

                    this.categoryList = response.data;

                    this.limit = response.limit;

                    this.currentLength = response.data.length;

                    this.maxLength = response.length;

                    this.dataLoaded = true;
                },
                (error: Response) => {
                    console.log('error in retrieving product categories', error);

                    this.dataLoaded = true;
                }
            )
    }

    selectPage(page: number) {

        this.currentPage = page;

        this.getAllProductCategories();
    }

    openAddModal() {

        const modalRef = this.modalService.open(AddCategoryModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop:'static',
        });

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllProductCategories();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    onEdit(category: ProductCategory) {

        this.openEditModal(category);
    }

    openEditModal(category: ProductCategory) {

        console.log('category currently being edited', category);

        const modalRef = this.modalService.open(EditCategoryModalComponent);

        modalRef.componentInstance.category = category;

        modalRef.result

            .then(
                (results) => {

                    console.log('closed modal success: ', results);

                    this.getAllProductCategories();
                }
            )
            .catch(
                (error) => console.log('error', error)
            );
    }

    onDelete(id: number) {

        this.alertService.confirm("Delete Category?")
            .then(()=>{
                this.deleteCategory(id);
            })
            .catch(()=>{});

    }

    deleteCategory(id: number) {
        this.categoryService.deleteCategory(id)
            .subscribe(
                (data) => {
                    this.onCategoryDeleted(id);
                    this.alertService.notifySuccess("Category successfully deleted");
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onCategoryDeleted(id:number) {

        console.log('deleted category id number: ', id);

        const position = this.categoryList.findIndex(
            (category: ProductCategory) => {
                return category.id == id;
            }
        );

        console.log('position of the category to be deleted: ', position);

        this.categoryList.splice(position, 1);
    }

    openExportModal(categories: ProductCategory[]) {

        const modalRef = this.modalService.open(ExportCategoriesModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop:'static',
        });

        modalRef.componentInstance.categories = categories;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllProductCategories();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

}

