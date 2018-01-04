import { Component, OnInit } from '@angular/core';

import {
    ModalService,
    AlertService,
    SearchService,
    PricingService,
} from '../../../shared';

import {
    AddPricingRuleModalComponent,
    EditPricingRuleModalComponent,
    ExportPricingModalComponent
} from '../../modals';

import {
    Pricing
} from '../../../classes';

@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.css'],
})

export class PricingComponent implements OnInit {

    title: string = 'PRICING';

    description: string = 'List of all pricing rules';

    pricingList: Pricing[] = [];

    query: string = "";
    maxLength: number;
    currentLength: number;
    limit: number;
    currentPage: number = 1;

    dataLoaded: boolean = true;

    private searchSubscription: any;

    constructor(
        private alertService: AlertService,
        private modalService: ModalService,
        private searchService: SearchService,
        private pricingService: PricingService
    ) {}

    ngOnInit() {

        this.searchService.isOn.emit(true);

        this.getAllPriceRules();

        this.searchSubscription = this.searchService.query.subscribe(
            (query) => {
                console.log('test');
                this.query = query;
                this.getAllPriceRules();
            },
            (error) => console.log('search error', error)
        );
    }

    openAddPricingRuleModalComponent() {
        const modalRef = this.modalService.open(AddPricingRuleModalComponent);

        //modalRef.componentInstance.name = 'World';
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllPriceRules();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

    getAllPriceRules() {

        this.dataLoaded = false;

        const currentPage = this.currentPage;

        const query = this.query;

        this.pricingService.getAllPricingRules(currentPage, query)
            .subscribe(
                (response) => {
                    console.log('the pricing list:', response.data);
                    this.pricingList = response.data;
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

    selectPage(page: number) {
        this.currentPage = page;
        this.getAllPriceRules();
    }

    setProductScope(product, size, metrics) {

        if (!product) {
            return 'All products'
        }

        let variation = '(' + size + ' ' + metrics + ')';

        return product + ' ' + variation;
    }

    setPriceRuleScope(ruleScope) {

        if (ruleScope == 'member') {
            return 'Members only';
        }

        if (ruleScope == 'guest') {
            return 'Guests only';
        }

        return 'All';
    }

    onEdit(priceRule: Pricing) {
        this.openEditPricingRuleModal(priceRule)
    }

    openEditPricingRuleModal(priceRule: Pricing) {

        console.log('the price rule being edited: ', priceRule);

        const modalRef = this.modalService.open(EditPricingRuleModalComponent);

        modalRef.componentInstance.priceRule = priceRule;
        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllPriceRules();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )

    }

    onDelete(id: number) {

        this.alertService.confirm("Delete this price rule?")
            .then(() => {
                this.deletePriceRule(id);
            })
            .catch(() => {
            });

    }

    deletePriceRule(id: number) {

        this.pricingService.deletePricingRule(id)
            .subscribe(
                (data) => {
                    this.onPriceRuleDeleted(id);
                    this.alertService.notifySuccess("Price rule successfully deleted");
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onPriceRuleDeleted(id: number) {

        console.log('deleted price rule id number: ', id);

        const position = this.pricingList.findIndex(
            (priceRule: Pricing) => {
                return priceRule.id == id;
            }
        );

        console.log('position of the price rule to be deleted: ', position);

        this.pricingList.splice(position, 1);
    }

    onDisable(data: Pricing) {

        const status = 'disabled';

        this.pricingService.updatePricingRule(data, status)
            .subscribe(
                (data) => {
                    this.alertService.notifySuccess('Price rule is now disabled');
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    onEnable(data: Pricing) {

        const status = 'active';

        this.pricingService.updatePricingRule(data, status)
            .subscribe(
                (data) => {
                    this.alertService.notifySuccess('Price rule is now active');
                },
                (error: Response) =>
                    console.log(error)
            )
    }

    setAmountOrQuantity(rule: Pricing) {

        if(rule.type == 'simple-discount') {

            return 'N/A';

        }

        if(rule.amount) {

            let amount = rule.amount.toFixed(2);

            return '₱' + ' ' + amount;

        }

        if(rule.quantity) {

            return rule.quantity + ' ' + 'pcs.'
        }
    }

    setPriceDiscount(rule: Pricing) {

        if(rule.discount_type == 'percent') {

            let discount = parseInt(rule.discount) + "%";

            return discount;
        }

        if(rule.discount_type == 'fixed') {

            return '₱' + rule.discount;
        }
    }

    setDiscountType(rule: Pricing) {

        if(rule.discount_type == 'percent') {

            return 'Percent';
        }

        return 'Fixed';
    }

    openExportModal(pricing: Pricing[]) {

        const modalRef = this.modalService.open(ExportPricingModalComponent, {
            keyboard: false,
            windowClass: 'fade',
            backdrop:'static',
        });

        modalRef.componentInstance.pricing = pricing;

        modalRef.result
            .then(
                (results) => {
                    console.log('closed modal success: ', results);
                    this.getAllPriceRules();
                }
            )
            .catch(
                (error) => console.log('error', error)
            )
    }

}
