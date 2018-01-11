import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/api/user.service";
import {User} from "../../../classes/user.class";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    currentUser: User = new User();

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.getProfile();
    }

    getProfile() {

        this.userService.getCurrentUserProfile()
            .subscribe(
                (response) => {
                    this.currentUser = response.data;
                },
                (error) => {
                    console.log('something went wrong while fetching current user profile', error);
                }
            )

    }

}
