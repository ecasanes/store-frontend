import {Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.css']
})
export class ErrorHandlerComponent implements OnChanges {

  @Input() errors: string[];
  @Input() validate: string;

  constructor() {

  }

  ngOnChanges() {
    console.log('errors: ', this.errors);
    console.log('validate: ', this.validate);
  }

}
