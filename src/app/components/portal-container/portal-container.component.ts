import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portal-container',
  templateUrl: './portal-container.component.html',
  styleUrls: ['./portal-container.component.scss']
})
export class PortalContainerComponent implements OnInit {
  collapsed = false;

  constructor() {}
  ngOnInit(): void {}
}
