import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'panel-title',
  templateUrl: './panel-title.component.html',
  styleUrls: ['./panel-title.component.css']
})
export class PanelTitleComponent implements OnInit {

  @Input() title: string = "";

  constructor() { }

  ngOnInit() {
  }

}
