import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Intervention } from 'src/app/models/intervention.interface';
import { InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-view-intervention',
  templateUrl: './view-intervention.component.html',
  styleUrls: ['./view-intervention.component.scss']
})
export class ViewInterventionComponent implements OnInit {
  public intervention$ = this.interventionsService.getInterventionById(
    this.route.snapshot.paramMap.get('interventionId')
  );
  public isUpdate: boolean;
  public selectedIntervention: Intervention;

  constructor(
    public route: ActivatedRoute,
    private interventionsService: InterventionsService
  ) {}

  ngOnInit(): void {}

  updateIntervention(intervention) {
    this.selectedIntervention = intervention;
    this.isUpdate = true;
  }
}
