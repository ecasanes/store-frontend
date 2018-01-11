import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services";
import {Constants} from "../constants";

@Injectable()
export class DashboardGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate() {

        const isAdmin = this.authService.validateAdminPrivileges();
        const isSeller = this.authService.validateSellerPrivileges();
        const isBuyer = this.authService.validateBuyerPrivileges();

        if(!isAdmin && !isSeller && !isBuyer){
            this.redirectToSignin();
            return false;
        }

        return true;
    }

    redirectToSignin() {
        this.router.navigate(["/signin"])
            .then(function(){
                console.log('success');
            })
            .catch(function(){
                console.log('error');
            });
    }

    redirectToInventory() {
        this.router.navigate(["/products"])
            .then(function(){
                console.log('success');
            })
            .catch(function(){
                console.log('error');
            });
    }

    redirectToSales() {
        this.router.navigate(["/sales"])
            .then(function(){
                console.log('success');
            })
            .catch(function(){
                console.log('error');
            });
    }
}