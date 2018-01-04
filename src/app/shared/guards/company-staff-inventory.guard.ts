import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services";
import {Constants} from '../constants';

@Injectable()
export class CompanyStaffInventoryGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate() {

        const hasCompanyPrivileges = this.authService.validateCompanyStaffPrivileges(Constants.getInventoryPermission);

        if(!hasCompanyPrivileges){
            this.redirectToDashboard();
            return false;
        }

        return true;
    }

    redirectToDashboard() {
        this.router.navigate(["/"])
            .then(function(){
                console.log('success');
            })
            .catch(function(){
                console.log('error');
            });
    }
}