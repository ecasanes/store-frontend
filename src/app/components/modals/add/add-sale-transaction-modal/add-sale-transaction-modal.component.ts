import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

import {
    ErrorResponseService,
    AlertService,
    AuthService,
    TransactionService,
    ProductService
} from "../../../../shared";

import {
    ErrorResponse,
    Product
} from '../../../../classes';

import {ProductVariation} from "../../../../classes/product-variation.class";
import {Transaction} from "../../../../classes/transaction.class";
import {Branch} from "../../../../classes/branch.class";
import {BranchService} from "../../../../shared/services/api/branch.service";
import {User} from "../../../../classes/user.class";
import {RoleService} from "../../../../shared/services/api/role.service";
import {UserService} from "../../../../shared/services/api/user.service";

@Component({
    selector: 'app-add-sale-transaction-modal',
    templateUrl: './add-sale-transaction-modal.component.html',
    styleUrls: ['./add-sale-transaction-modal.component.css']
})
export class AddSaleTransactionModalComponent implements OnInit {

    errorResponse: ErrorResponse = new ErrorResponse();

    productVariations: ProductVariation[];

    newTransaction: Transaction = new Transaction();
    total: number = 0;

    saleType:string = 'sale';

    branches: Branch[] = [];
    staffs: User[] = [];

    defaultVat: number = 0.12;
    customer: string = '';
    customerType: string = '';
    customerName: string = '';
    memberId: number;

    currentErrorCode: string;

    currentBranchKey: any;

    constructor(public activeModal: NgbActiveModal,
                private authService: AuthService,
                private transactionService: TransactionService,
                private errorResponseService: ErrorResponseService,
                private productService: ProductService,
                private branchService: BranchService,
                private roleService: RoleService,
                private userService: UserService,
                private alertService: AlertService) {

        this.checkSession();
        this.getAllProductVariations();
        this.getBranches();
        this.getAllStaff();
        this.initializeTransaction();

        // only for testing
        //this.newTransaction.key = '11111111';
        //this.newTransaction.staff_id = '90642395';
    }

    ngOnInit() {
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

    initializeTransaction() {

        this.newTransaction.items.push(new ProductVariation());

        console.log('newTransaction: ', this.newTransaction);

    }

    getBranches() {

        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branches = response.data;
                },
                (error: Response) =>
                    console.log(error)
            );

    }

    getAllStaff() {

        const currentPage = 1;
        const query = '';

        this.roleService.getStaffRoles(currentPage, query)
            .subscribe(
                (response) => {
                    console.log("get staff response", response.data);
                    this.staffs = response.data;
                },
                (error: Response) => {
                    console.log('An error occurred while retrieving all staff data', error);
                }
            )

    }

    onSaveTransaction() {
        const transaction = this.newTransaction;
        const customerType = this.customerType;
        this.validateTransaction(transaction, customerType)
            .then(
                (response) => {
                    this.alertService.notifySuccess('Imaginary Transaction');
                },
                (error) => {
                    const errorCode = this.currentErrorCode;
                    console.log('THE ERROR', error);
                    console.log('CURRENT ERROR CODE', this.currentErrorCode);
                    this.showAlert(errorCode);
                }
            );
        // if(this.customerType == 'member') {
        //     this.newTransaction.customer_firstname = '';
        //     this.newTransaction.customer_lastname = '';
        //     let memberId: number = this.memberId;
        //     this.getCustomerUser(memberId);
        //     return;
        // }
        //
        // console.log('CREATE GUEST TRANSACTION: ', this.newTransaction);
        //


    }

    validateTransaction(transaction, customerType): Promise<boolean> {
        console.log('VALIDATE THIS TRANSACTION', transaction);
        const branchId = transaction.branch_id;
        const date = transaction.created_at;
        const orNum = transaction.or_no;
        const staffId = transaction.staff_id;
        const customerFirstname = transaction.customer_firstname;
        const customerLastname = transaction.customer_lastname;
        const memberId = transaction.customer_id;
        const itemsLength = transaction.items.length;
        const items = transaction.items;

        return new Promise(
            (resolve, reject) => {
                if(itemsLength) {
                    items.forEach(
                        (item) => {
                            if(!item.quantity) {
                                this.currentErrorCode = 'quantity_required'
                            }

                            if(!item.product_variation_id) {
                                this.currentErrorCode = 'product_required';
                            }
                        }
                    )
                }

                if(!customerType) {
                    this.currentErrorCode = 'customer_type_required';
                }

                if(!date){
                    this.currentErrorCode = 'date_required';
                }

                if(!orNum) {
                    this.currentErrorCode = 'or_number_required';
                }

                if(!staffId) {
                    this.currentErrorCode = 'staff_id_required';
                }

                if(!branchId || branchId == 'null') {
                    this.currentErrorCode = 'branch_id_required';
                }

                if(customerType) {
                    if(customerType == 'guest') {
                        if(!customerLastname) {
                            this.currentErrorCode = 'lastname_required';
                        }

                        if(!customerFirstname) {
                            this.currentErrorCode = 'firstname_required';
                        }
                    }

                    if(customerType == 'member') {
                        if(!memberId) {
                            this.currentErrorCode = 'member_id_required';
                        }
                    }
                }

                if(this.currentErrorCode) {
                    reject(false);
                }

                if(!this.currentErrorCode) {
                    resolve(true);
                }

            }
        )
    }


    onUpdate() {

    }

    getAllProductVariations() {

        this.productService.getAllProductVariations()
            .subscribe(
                (response) => {
                    this.productVariations = response.data
                    console.log('PRODUCT VARIATIONS LIST:', response.data);
                    // this.setProductVariations(response.data);
                },
                (error: Response) =>
                    console.log(error)
            );

    };

    getCustomerUser(memberId: number) {
        this.userService.getCustomerByMemberId(memberId)
            .subscribe(
                (response) => {
                    console.log('getCustomerUser response:', response.data);
                    this.newTransaction.customer_user_id = response.data.id;
                    // this.newTransaction.customer_id = memberId;
                    this.newTransaction.customer_firstname = response.data.firstname;
                    this.newTransaction.customer_lastname = response.data.lastname;
                    console.log('CREATE MEMBER TRANSACTION: ', this.newTransaction);
                    this.createSaleTransaction();
                }, (error) => {
                    alert('Something went wrong while fetching the customer user');
                }
            );
    }

    createSaleTransaction() {
        this.transactionService.createSaleTransaction(this.newTransaction)
            .map(
                (productRes) => {
                    console.log('product response: ', productRes);
                    return productRes;
                }
            )
            .subscribe(
                (productRes) => {
                    console.log('the on save data', productRes);
                    this.activeModal.close({test: 'hello'});
                },
                (error) => {
                    error = JSON.parse(error._body);
                    this.alertService.error('Error', error.message);
                    this.errorResponse = this.errorResponseService.handleError(error);
                }
            );
    }

    onRemoveItem(item:ProductVariation, index: number){

        const position = this.productVariations.findIndex((variation: ProductVariation) => {
            if(variation.product_variation_id == item.product_variation_id){
                return true;
            }
        });

        this.productVariations[position].isSelected = false;
        this.newTransaction.removeCartItem(index);

    }

    onAddItem() {
        const currentItems = this.newTransaction.items;
        this.newTransaction.items.push(new ProductVariation());
        console.log(this.newTransaction.items);
    }

    onSetQuantity() {

        const transaction = this.newTransaction;

        this.setBranchKey(transaction.branch_id);

    }

    calculateDiscount() {
        console.log('Calculating discount');
        // this.calculatingDiscount = true;

        const transaction = this.newTransaction;
        const productVariations = this.productVariations;
        console.log('TRANSACTION calculate discount:', transaction);
        console.log('PRODUCT VARIATIONS:', productVariations);

        this.transactionService.calculateDiscount(transaction)
            .subscribe(
                (response) => {
                    const discount = response.data;
                    const total = this.newTransaction.computeTotal();
                    console.log('calculated discount:', response.data);
                    console.log('calculated total:', total);
                    this.newTransaction.discount = discount;
                    this.newTransaction.total = total - discount;

                    // this.calculatingDiscount = false;

                }, (error) => {
                    console.log('This is the error man', error);
                    this.newTransaction.items[0] = new ProductVariation();
                    // alert('Please select a branch first');
                    let errorCode: string = 'branch_id_required_discount';
                    this.showAlert(errorCode);
                    // this.calculatingDiscount = false;
                });


    }

    setTransactionItems() {
        const productVariations = this.productVariations;

        productVariations.forEach((variation) => {
            this.newTransaction.items.forEach((item) => {
               if(variation.product_variation_id == item.product_variation_id) {
                   item.name = variation.name;
                   item.selling_price = variation.selling_price;
               }
            });
        });

        this.calculateDiscount();
    }

    setBranchKey(branchId) {
        const branches = this.branches;

        branches.forEach((branch) => {
            if(branch.id == branchId) {
                console.log('branch id is:', branchId);
                console.log('branch key:', branch.key);
                this.newTransaction.key = branch.key;
            }
        });

        this.setTransactionItems();

    }

    onInputMemberId(memberId) {
        if(this.customerType != 'member') {
            return alert('You need to select the customer as a member ');
        }

        this.newTransaction.customer_id = memberId;
    }

    onSelectGuestCustomerType() {
        if(this.newTransaction.customer_id) {
            this.newTransaction.customer_id = '';
        }
    }

    onSetProduct(item) {
        if(item.quantity) {
            this.calculateDiscount();
        }
    }

    showAlert(code) {
        this.currentErrorCode = '';
        console.log('SHOW ALERT CODE', code);
        let title: string;
        let message: string;

        switch(code) {
            case 'staff_id_required':
                title = 'Staff Required';
                message = 'Please choose a staff for this transaction';
                break;
            case 'or_number_required':
                title = 'OR Number Required';
                message = 'Please input the OR number of this transaction';
                break;
            case 'date_required':
                title = 'Date Required';
                message = 'Please input the date of this transaction';
                break;
            case 'branch_id_required':
                title = 'Branch Required';
                message = 'Please choose a branch for this transaction';
                break;
            case 'branch_id_required_discount':
                title = 'Select a Branch';
                message = 'Please choose a branch first before adding products in the transaction';
                break;
            case 'lastname_required':
                title = 'Lastname Required';
                message = "Please input the customer's lastname";
                break;
            case 'firstname_required':
                title = 'Firstname Required';
                message = "Please input the customer's firstname";
                break;
            case 'member_id_required':
                title = 'Membership ID Required';
                message = 'Please input the membership ID for this transaction';
                break;
            case 'customer_type_required':
                title = 'Customer Type Required';
                message = 'Please indicate if the customer is a member or not';
                break;
            case 'quantity_required':
                title = 'Quantity Required';
                message = 'Please make sure to input the quantity of the products in the transaction';
                break;
            case 'product_required':
                title = 'Product Required';
                message = 'Please make sure to include all the products in the transaction';
                break;
        }

        console.log('THE TITLE', title);
        console.log('THE MESSAGE', message);

        this.alertService.error(title, message);
    }

}
