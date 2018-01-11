import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services";

@Injectable()
export class BuyerGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate() {

        const isLoggedIn = this.authService.isLoggedIn();
        const hasBuyerPrivileges = this.authService.validateBuyerPrivileges();

        if(isLoggedIn && hasBuyerPrivileges){
            return true;
        }

        this.redirect();
        return false;
    }

    redirect() {
        this.router.navigate(["/"])
            .then(function(){
                console.log('success');
            })
            .catch(function(){
                console.log('error');
            });
    }
}