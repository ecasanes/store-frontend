import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services";
import {Constants} from "../constants";

@Injectable()
export class DashboardGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate() {

        const hasCompanyPrivileges = this.authService.validateCompanyPrivileges();
        const hasCompanyStaffInventoryPrivileges = this.authService.validateCompanyStaffPrivileges(Constants.getInventoryPermission);
        const hasCompanyStaffSalesPrivileges = this.authService.validateCompanyStaffPrivileges(Constants.getSalesPermission);

        if(!hasCompanyPrivileges && !hasCompanyStaffInventoryPrivileges && !hasCompanyStaffSalesPrivileges){
            this.redirectToSignin();
            return false;
        }

        if(!hasCompanyPrivileges && hasCompanyStaffInventoryPrivileges){
            this.redirectToInventory();
            return false;
        }

        if(!hasCompanyPrivileges && hasCompanyStaffInventoryPrivileges){
            this.redirectToSales();
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