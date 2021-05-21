import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Intervention } from 'src/app/models/intervention.interface';
import { InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-create-intervention',
  templateUrl: './create-intervention.component.html',
  styleUrls: ['./create-intervention.component.scss'],
})
export class CreateInterventionComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private interventionsService: InterventionsService) {}

  ngOnInit(): void {}

  onSubmit(intervention: Intervention) {
    this.buttonState = ClrLoadingState.LOADING;
    intervention.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.interventionsService.createIntervention(intervention).then(
      () => {
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      () => {
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
