import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    hasUserPrivileges(){
        return true;
    }

    canActivate() {

        const isLoggedIn = this.authService.isLoggedIn();

        if(!isLoggedIn){
            this.redirectToLogin();
            return false;
        }

        return true;
    }

    redirectToLogin() {
        this.router.navigate(["/signin"])
            .then(function(){
                console.log('success');
            })
            .catch(function(){
                console.log('error');
            });
    }
}