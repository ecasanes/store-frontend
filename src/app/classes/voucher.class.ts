export class Voucher {

    id?:number;
    name: string;
    code: string;
    start: any;
    end: any;
    status:string;
    discount_type:string;
    discount:number;

    setNew(voucher: Voucher){
        this.id = voucher.id;
        this.name = voucher.name;
        this.code = voucher.code;
        this.start = voucher.start;
        this.end = voucher.end;
        this.status = voucher.status;
        this.discount_type = voucher.discount_type;
        this.discount = voucher.discount;
    }
}