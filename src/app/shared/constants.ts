import {environment} from "../../environments/environment";

export class Constants {

    public static get baseUrl(): string {
        return environment.url;
    };

    public static get adminRole(): string {
        return 'admin';
    }

    public static get buyerRole(): string {
        return 'buyer';
    }

    public static get sellerRole(): string {
        return 'seller';
    }

    public static get getNone(): string {
        return 'none';
    }

}