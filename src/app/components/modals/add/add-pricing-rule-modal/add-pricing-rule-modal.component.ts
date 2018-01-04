import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    ProductService,
    ErrorResponseService,
    AuthService,
    PricingService
} from "../../../../shared";

import {
    Pricing,
    ErrorResponse,
    ProductVariation
} from '../../../../classes';
import {Constants} from "../../../../shared/constants";

@Component({
    selector: 'app-add-pricing-rule-modal',
    templateUrl: './add-pricing-rule-modal.component.html',
    styleUrls: ['./add-pricing-rule-modal.component.css']
})
export class AddPricingRuleModalComponent implements OnInit {

    title: string = 'ADD PRICE RULE';
    instruction: string = 'Fill up the required fields below to add a rule';

    priceRule: Pricing = new Pricing();
    productVariationsList: ProductVariation[];

    ruleTypeList: any = Constants.ruleTypes;

    errorResponse: ErrorResponse = new ErrorResponse();

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private productService: ProductService,
                private errorResponseService: ErrorResponseService,
                private pricingService: PricingService,) {
        this.checkSession();
    }

    ngOnInit() {

        this.priceRule.discount_type = 'percent';

        this.priceRule.apply_to = 'all';

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
                    console.log('list of product variations', this.productVariationsList);
                },
                (error: Response) => {
                    console.log('error in getting product variations:', error);
                }
            );
    }

    onSave() {

        console.log('the price rule to be created', this.priceRule);

        const data = this.priceRule;

        this.pricingService.createPricingRule(data)
            .map(
                (response) => {
                    console.log('price rule response', response);
                    return response;
                }
            )
            .subscribe(
                (response) => {
                    console.log('the on save data (?)', response);
                    this.activeModal.close({test: 'Goodbye'});
                },
                (error) => {
                    this.errorResponse = this.errorResponseService.handleError(error);
                }
            )
    }

}
