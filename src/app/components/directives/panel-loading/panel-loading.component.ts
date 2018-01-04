import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'panel-loading',
    templateUrl: './panel-loading.component.html',
    styleUrls: ['./panel-loading.component.css']
})
export class PanelLoadingComponent implements OnInit {

    @Input() load: boolean = false;
    @Input('text') loadingText: string = "Loading data...";
    @Input() type: string = 'normal';

    constructor() {
    }

    ngOnInit() {

    }

}
