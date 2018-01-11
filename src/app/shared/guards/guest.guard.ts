import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services";

@Injectable()
export class GuestGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    hasUserPrivileges(){
        return true;
    }

    canActivate() {

        const isLoggedIn = this.authService.isLoggedIn();

        if(!isLoggedIn){
            return true;
        }

        if(this.authService.validateBuyerPrivileges()){
            this.redirectToProducts();
        }else{
            this.redirectToProfile();
        }

        return false;
    }

    redirectToProfile() {
        this.router.navigate(["/profile"])
            .then(function(){
                console.log('success');
            })
            .catch(function(){
                console.log('error');
            });
    }

    redirectToProducts() {
        this.router.navigate(["/products"])
            .then(function(){
                console.log('success');
            })
            .catch(function(error){
                console.log('error', error);
            });
    }
}