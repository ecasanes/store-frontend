import {Component, Input, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    ProductService,
    ErrorResponseService,
    AuthService,
    BranchService,
    DeliveryService
} from "../../../../shared";

import {
    ErrorResponse,
    ProductVariation,
    Branch,
    NewDelivery
} from '../../../../classes';
import {Constants} from "../../../../shared/constants";

@Component({
    selector: 'app-add-delivery-modal',
    templateUrl: './add-delivery-modal.component.html',
    styleUrls: ['./add-delivery-modal.component.css']
})
export class AddDeliveryModalComponent implements OnInit {


    @Input() name;

    newDelivery: NewDelivery = new NewDelivery();

    productVariations: ProductVariation[] = [];

    branches: Branch[] = [];
    isFranchisee: boolean = false;

    allDeliveryItems: any = false;

    hideAddItem: any = false;

    errorResponse: ErrorResponse = new ErrorResponse();

    updating: boolean = false;

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private productService: ProductService,
                private branchService: BranchService,
                private deliveryService: DeliveryService,
                private errorResponseService: ErrorResponseService) {
        this.checkSession();
        this.getBranches();
        this.getAllProductVariations();
    }


    ngOnInit() {
    }

    onAddDeliveryItem() {
        this.newDelivery.addNewDeliveryItem();
    }

    onRemoveDeliveryItem(index) {
        this.newDelivery.removeDeliveryItem(index);
    }

    onAddAllDeliveryItems(isChecked) {
        this.hideAddItem = isChecked;
        console.log('isChecked', isChecked);
        this.newDelivery.addAllDeliveryItems(this.productVariations, isChecked);
    }

    checkSession() {

        this.authService.dismissCurrentModal.subscribe(
            needsAuth => {

                if (needsAuth) {
                    console.log('Session has expired! Modal will  be closed');
                    setTimeout(() => {
                        this.activeModal.dismiss({message: "Session has expired!"});
                    }, 100);
                    //this.authService.showModal.emit(true);
                    this.authService.confirm.emit(true);
                }

            },
            error => {
                console.log('error', error)
            }
        )
    }

    getAllProductVariations() {

        this.productService.getAllProductVariations()
            .subscribe(
                (response) => {
                    this.productVariations = response.data;
                },
                (error: Response) =>
                    console.log(error)
            );

    };

    getBranches() {
        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branches = response.data;
                    console.log('BRANCHES: ', this.branches);
                },
                (error: Response) =>
                    console.log(error)
            );
    }

    onSave() {

        this.updating = true;

        console.log('the product: ', this.newDelivery);
        const delivery = this.newDelivery;

        this.deliveryService.addDelivery(delivery)
            .map(
                (productRes) => {
                    console.log('product response: ', productRes);
                    return productRes;
                }
            )
            .subscribe(
                (productRes) => {
                    console.log('the on save data', productRes);
                    this.updating = false;
                    this.activeModal.close();
                },
                (error) => {
                    console.log('must handle this error: ', error);
                    this.updating = false;
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }

    test(item: ProductVariation) {

        /* const position = this.productVariations.findIndex(
         (variation: ProductVariation) => {
         return variation.id == item.id;
         }
         );

         this.productVariations.splice(position, 1);*/
    }

    verifyIfFranchisee(branchId: number) {

        const branch = this.branches.find(function (singleBranch) {
            if (singleBranch.id == branchId) {
                return true;
            }
            return false;
        });

        if(branch.type != Constants.franchiseeFlag){
            this.isFranchisee = false;
            return false;
        }

        this.isFranchisee = true;
        return true;

    }

}
