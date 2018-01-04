import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    AuthService,
    PricingService,
    ProductService,
    ErrorResponseService
} from "../../../../shared";

import {
    Pricing,
    ErrorResponse,
    ProductVariation
} from '../../../../classes';
import {Constants} from "../../../../shared/constants";



@Component({
    selector: 'app-edit-pricing-rule-modal',
    templateUrl: './edit-pricing-rule-modal.component.html',
    styleUrls: ['./edit-pricing-rule-modal.component.css']
})

export class EditPricingRuleModalComponent implements OnInit {

    title: string = 'EDIT PRICE RULE';
    instruction: string = 'Fill up the required fields below to add a rule';

    @Input() priceRule: Pricing = new Pricing();
    productVariationsList: ProductVariation[];

    ruleTypeList: any = Constants.ruleTypes;

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(
       private authService: AuthService,
       public activeModal: NgbActiveModal,
       private pricingService: PricingService,
       private productService: ProductService,
       private errorResponseService: ErrorResponseService
    ) {
        this.checkSession();
    }

    ngOnInit() {
        this.getProductVariations();
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

    getProductVariations() {
        this.productService.getAllProductVariations()
            .subscribe(
                (response) => {
                    this.productVariationsList = response.data;
                    console.log('list of product variations',this.productVariationsList);
                },
                (error: Response) => {
                    console.log('error in getting product variations:', error);
                }
            );
    }

    onUpdate() {

        console.log('the price rule: ', this.priceRule);
        const priceRule = this.priceRule;

        this.pricingService.updatePricingRule(priceRule)
            .map(
                (response) => {
                    console.log('price rule response: ', response);
                    return response;
                }
            )
            .subscribe(
                (response) => {
                    console.log('the on save data', response);
                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    //console.log('must handle this error: ', error);
                    this.errorResponse = this.errorResponseService.handleError(error)
                }
            );

    }
}