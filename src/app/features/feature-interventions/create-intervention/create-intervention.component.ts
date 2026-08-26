import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Intervention } from 'src/app/models/intervention.interface';
import { Utilities } from 'src/app/models/utils';
import { InterventionsService, SurveysService } from 'src/app/services';

@Component({
  selector: 'app-create-intervention',
  templateUrl: './create-intervention.component.html',
  styleUrls: ['./create-intervention.component.scss'],
})
export class CreateInterventionComponent implements OnInit {
  @Input() categoryId: string;
  @Output() closeModal = new EventEmitter();
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(
    private interventionsService: InterventionsService,
    private surveysService: SurveysService
  ) {}

  ngOnInit(): void {}

  onSubmit(intervention: Intervention) {
    this.buttonState = ClrLoadingState.LOADING;
    intervention.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.interventionsService.createIntervention(intervention).then(
      async (docRef) => {
        // Every intervention ships with its Before / Midline / Endline surveys
        // as empty drafts. A failure here must not lose the intervention, so it
        // is reported and left for the "Set up surveys" action to retry.
        await this.surveysService
          .ensurePhaseSurveys({ ...intervention, id: docRef.id })
          .catch(() =>
            Utilities.displayToast(
              'warning',
              'Intervention created, but its Before/Midline/Endline surveys could not be set up. Use “Set up surveys” to retry.'
            )
          );
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      () => {
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
