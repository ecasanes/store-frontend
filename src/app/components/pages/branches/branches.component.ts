import { Component, OnInit } from '@angular/core';
import {Response} from "@angular/http";

import {
    AuthService,
    BranchService
} from '../../../shared';

import {
    Branch
} from '../../../classes';


@Component({
    selector: 'app-branches',
    templateUrl: './branches.component.html',
    styleUrls: ['./branches.component.css']
})

export class BranchesComponent implements OnInit{

    branches: Branch[];

    constructor(
        private authService: AuthService,
        private branchService: BranchService,
    ){

    }

    ngOnInit() {
        this.getAll();
    }

    getAll() {
        this.branchService.getBranches()
            .subscribe(
                (response) => {
                    this.branches = response.data;
                },
                (error: Response) =>
                    console.log(error)
            )
    }
}