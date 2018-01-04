import {environment} from "../../environments/environment";

export class Constants {

    public static get baseUrl(): string {
        return environment.url;
    };

    public static get defaultMetrics(): string {
        return "ml";
    };

    public static get getMetrics(): {name:string, value:string}[]{
        return [
            {
                name: "Milliliters",
                value: "ml"
            },
            {
                name: "Liters",
                value: "l"
            }
        ];
    }

    public static get getConfirmedStatus(): string {
        return 'confirmed';
    }

    public static get getAdminRole(): string {
        return 'admin';
    }

    public static get getCompanyRole(): string {
        return 'company';
    }

    public static get getCompanyStaffRole(): string {
        return 'company_staff';
    }

    public static get getInventoryPermission(): string {
        return 'inventory';
    }

    public static get getSalesPermission(): string {
        return 'sales';
    }

    public static get getPendingStatus(): string {
        return 'pending';
    }

    public static get getInventoryGroup(): string {
        return 'inventory';
    }

    public static get getSaleGroup(): string {
        return 'sale';
    }

    public static get getNone(): string {
        return 'none';
    }

    public static get voidFlag(): string {
        return 'void';
    }

    public static get activeFlag(): string {
        return 'active';
    }

    public static get returnSaleCode(): string {
        return 'return_sale';
    }

    public static get saleCode(): string {
        return 'sale';
    }

    public static get vat(): number {
        return 0.12;
    }

    public static get adjustmentGroup(): string {
        return 'adjustment'
    }

    public static get adjustmentShortOverCode(): string {
        return 'adjustment_shortover';
    }

    public static get adjustmentShortCode(): string {
        return 'adjustment_short';
    }

    public static get eventRefreshSale(): string {
        return 'event_refresh_sale';
    }

    public static get eventUpdateNotification(): string {
        return 'event_update_notification';
    }

    public static get eventNotificationToast(): string {
        return 'event_notification_toast';
    }

    public static get franchiseeFlag(): string {
        return 'franchisee';
    }

    public static get ruleTypes(): {code:string,label:string}[] {

        return [
            { code: 'simple-discount', label: 'Simple Discount'},
            { code: 'spend-x-get-discount', label: 'Spend X To Get A Discount' },
            { code: 'buy-x-get-discount', label: 'Buy X To Get A Discount' },
            { code: 'no-discount', label: 'No Discount' },
            { code: 'special-discount', label: 'Special Discount' }
        ];

    }
}