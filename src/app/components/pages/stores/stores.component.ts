import {Component, OnInit} from "@angular/core";

import {
    ModalService,
    BranchService,
    ErrorResponseService,
    AlertService
} from '../../../shared';

import {
    Branch,
    ErrorResponse
} from '../../../classes';

import {
    AddStoreModalComponent,
    EditStoreModalComponent
} from '../../modals';
import {SearchService} from "../../../shared/services/helpers/search.service";


@Component({
    selector: 'app-stores',
    templateUrl: './stores.component.html',
    styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

    branches: Branch[] = [];
    currentBranch: Branch = new Branch();

    loadingStoreInventory:boolean = false;

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
        private modalService: ModalService,
        private branchService: BranchService,
        private errorService: ErrorResponseService,
        private alertService: AlertService,
        private searchService: SearchService
    ) {
    }

    ngOnInit() {

        this.searchService.isOn.emit(false);

        this.getBranches();
    }

    getBranches() {
        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    console.log('branches response: ', response);
                    this.branches = response.data;
                },
                (error) => console.log("There is something wrong while fetching all branches:", error)
            )
    }

    viewBranch(branch: Branch) {

        if (branch.isViewed) {
            branch.isViewed = false;
            this.currentBranch.isViewed = false;
            this.currentBranch = new Branch();
            return false;
        }

        this.loadingStoreInventory = true;
        this.currentBranch.isViewed = false;
        branch.isViewed = true;

        this.branchService.getBranchById(branch.id)
            .subscribe(
                (response) => {
                    console.log('single branch response: ', response);
                    branch.items = [];
                    branch.items = response.data.items;
                    this.currentBranch = branch;
                    this.loadingStoreInventory = false;
                },
                (error) => {
                    this.loadingStoreInventory = false;
                    console.log("There is something wrong while fetching single branch:", error)
                }
            )
    }

    onEdit(branch: Branch){

        this.openEditStoreModal(branch);

    }

    onDelete(branch: Branch) {

        this.alertService.confirm("Delete this branch?")
            .then(()=>{
                this.deleteBranch(branch);
            })
            .catch(()=>{});

    }

    openAddStoreModal() {

        const modalRef = this.modalService.open(AddStoreModalComponent);

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getBranches();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    openEditStoreModal(branch: Branch) {

        const modalRef = this.modalService.open(EditStoreModalComponent);

        modalRef.componentInstance.branch = branch;
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getBranches();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    deleteBranch(branch: Branch){

        this.branchService.deleteBranch(branch.id)
            .subscribe(
                (response) => {
                    this.getBranches();
                    this.alertService.notifySuccess('Store successfully deleted');
                },
                (error) => {
                    console.log('error', error);
                    this.errorResponse = this.errorService.handleError(error)
                }
            )
    }

}
