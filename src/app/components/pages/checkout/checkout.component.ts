import {Component, OnInit} from "@angular/core";
import {Response} from "@angular/http";
import {Router} from "@angular/router";

import {
    AlertService,
    AuthService,
    CategoryService,
    DashboardEventService,
    ProductService,
} from "../../../shared";

import {
    Product,
    ProductCategory
} from '../../../classes';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";
import {TransactionService} from "../../../shared/services/api/transaction.service";
import {Order} from "../../../classes/order.class";
import {ErrorResponseService} from "../../../shared/services/helpers/error-response.service";
import {ErrorResponse} from "../../../classes/error-response.class";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    products: Product[] = [];
    categories: ProductCategory[];

    baseTotal: number = 0;
    totalPrice: number = 0;

    paymentMethods: any[] = [];

    order: Order = new Order();

    productsMaxLength: number;
    productsCurrentLength: number;
    productsLimit: number;
    productsCurrentPage: number = 1;

    panelTitle: string = "Products";

    userId: number = null;
    categoryId: number = null;

    query: string = "";

    currentUser: User = new User();

    loadingData: boolean = false;

    errorResponse: ErrorResponse = new ErrorResponse();

    hasDiscount: boolean = false;
    currentVoucher = null;

    constructor(public router: Router,
                private authService: AuthService,
                private productService: ProductService,
                private userService: UserService,
                private dashboardEventService: DashboardEventService,
                private alertService: AlertService,
                private errorResponseService: ErrorResponseService,
                private transactionService: TransactionService) {
        this.userId = this.authService.getUserId();
        this.order.buyer_user_id = this.userId;
    }

    ngOnInit() {
        this.getProducts();
        this.getPaymentMethods();
        this.getCurrentUser();
    }

    getProducts() {

        this.loadingData = true;

        const currentPage = this.productsCurrentPage;
        const categoryId = this.categoryId;
        const query = this.query;
        const userId = this.userId;

        this.productService.getProducts(currentPage, categoryId, query, 'none', userId)
            .subscribe(
                (response) => {
                    this.setProducts(response.data);
                    this.productsLimit = response.limit;
                    this.productsCurrentLength = response.data.length;
                    this.productsMaxLength = response.length;
                    this.loadingData = false;

                    this.calculateTotalPrice();

                },
                (error: Response) => {
                    this.loadingData = false;
                    console.log(error);
                }
            )
    }

    getPaymentMethods() {

        this.productService.getAllPaymentMethods()
            .subscribe(
                (response) => {
                    this.paymentMethods = response;
                },
                (error) => {
                    console.log('something went wrong while getting all payment methods: ', error);
                }
            )

    }

    setProducts(data: any[]) {

        let products: Product[] = [];

        data.forEach(
            (item) => {
                const product = new Product();
                product.product_variation_id = item.product_variation_id;
                product.quantity = item.cart_quantity;
                product.cart_quantity = item.cart_quantity;
                product.name = item.name;
                product.selling_price = item.selling_price;
                product.shipping_price = item.shipping_price;
                product.total_branch_quantity = item.total_branch_quantity;
                product.in_cart = item.in_cart;
                product.store_id = item.store_id;
                products.push(product);
            }
        );

        this.products = products;
        this.order.products = this.products.filter(
            (product) => {
                return product.in_cart == 1;
            }
        );


    }

    onRemoveInCart(product: Product) {

        this.productService.removeInCart(this.userId, product.product_variation_id)
            .subscribe(
                (response) => {
                    this.getProducts();
                    product.in_cart = 0;
                    this.dashboardEventService.onCartChange.emit(true);
                },
                (error) => {
                    console.log('something went wrong while adding to wishlist', error);
                }
            )

    }

    calculateTotalPrice() {

        let total = 0;

        this.products.forEach(
            (product) => {
                if (product.in_cart == 1 && product.total_branch_quantity > 0) {
                    total += parseFloat(product.quantity * product.selling_price + '');
                }
            }
        );

        this.products.forEach(
            (product) => {
                if (product.in_cart == 1 && product.total_branch_quantity > 0) {
                    total += parseFloat(product.quantity * product.shipping_price + '');
                }
            }
        );

        this.baseTotal = total;

        if (this.currentVoucher) {

            const type = this.currentVoucher.discount_type;
            const discount = this.currentVoucher.discount;

            if (type == 'percent') {
                total = total - (total * discount);
            }

            if (type == 'fixed') {
                total = total - discount;
            }

        }

        this.totalPrice = total;

    }

    calculateTotalVoucherDiscount() {

        if (!this.currentVoucher) {
            return 0;
        }

        console.log(this.currentVoucher);

        const type = this.currentVoucher.discount_type;
        const discount = this.currentVoucher.discount;

        if (type == 'percent') {
            return this.baseTotal * discount;
        }

        if (type == 'fixed') {
            return discount;
        }


    }

    hasCardPaymentMethod() {

        const index = this.paymentMethods.findIndex(
            (method) => {
                return method.id == this.order.payment_mode_id;
            }
        );

        if (index == -1) {
            return false;
        }

        if (this.paymentMethods[index].code == 'debit' || this.paymentMethods[index].code == 'credit') {
            return true;
        }

        return false;

    }

    getCurrentUser() {

        this.userService.getCurrentUserProfile()
            .subscribe(
                (response) => {
                    this.currentUser = response.data;
                    this.order.address = this.currentUser.address;
                }
            )

    }

    onConfirmOrder() {

        const order = this.order;

        this.transactionService.addOrder(order)
            .subscribe(
                (response) => {
                    console.log('response', response);
                    this.alertService
                        .confirm("Order Success", "You will be redirected to order history page.", "OK")
                        .then(
                            (response) => {
                                this.dashboardEventService.onCartChange.emit(true);
                                this.router.navigateByUrl('/buyer-orders');
                            }
                        )
                },
                (error) => {
                    this.errorResponse = this.errorResponseService.handleError(error);
                }
            )

    }

    calculateVoucherDiscount() {

        const voucher = this.order.voucher;

        this.productService.getVoucherByCode(voucher)
            .subscribe(
                (response) => {

                    if (response) {
                        this.hasDiscount = true;
                        this.currentVoucher = response;
                        this.calculateTotalPrice();
                        return;
                    }

                    this.hasDiscount = false;
                    this.currentVoucher = null;
                    this.calculateTotalPrice();
                    return;
                },
                (error) => {
                    console.log('something went wrong while getting voucher', error);
                }
            )

    }

}
