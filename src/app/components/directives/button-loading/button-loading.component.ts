import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'button-loading',
    templateUrl: './button-loading.component.html',
    styleUrls: ['./button-loading.component.css']
})
export class ButtonLoadingComponent implements OnInit {

    @Input() load: boolean = false;
    @Input('text') loadingText: string = "PROCESSING";
    @Input() type: string = 'normal';

    constructor() {
    }

    ngOnInit() {

    }

}
