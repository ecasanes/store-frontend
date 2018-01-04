import {Component, Input, OnInit} from '@angular/core';

import {ErrorResponseService} from "../../../shared";
import {ErrorResponse} from "../../../classes";

@Component({
  selector: 'alert-error-handler',
  templateUrl: './alert-error-handler.component.html',
  styleUrls: ['./alert-error-handler.component.css']
})
export class AlertErrorHandlerComponent implements OnInit {

  @Input() errorResponse: ErrorResponse = new ErrorResponse();
  @Input() type: string = 'alert';

  constructor(private errorService: ErrorResponseService) { }

  ngOnInit() {
  }

  onDismiss() {
    this.errorResponse = new ErrorResponse();
  }

}
