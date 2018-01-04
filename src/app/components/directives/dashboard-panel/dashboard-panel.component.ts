import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})
export class DashboardPanelComponent implements OnInit {

  @Input() header: string = 'this is header';

  constructor() { }

  ngOnInit() {
  }

}
