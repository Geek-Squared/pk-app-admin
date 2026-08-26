import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { InterventionsService, SurveysService } from 'src/app/services';

@Component({
  selector: 'app-delete-intervention',
  templateUrl: './delete-intervention.component.html',
  styleUrls: ['./delete-intervention.component.scss'],
})
export class DeleteInterventionComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() interventionId: string;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(
    private interventionsService: InterventionsService,
    private surveysService: SurveysService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.buttonState = ClrLoadingState.LOADING;
    this.interventionsService.deleteIntervention(this.interventionId).then(
      async () => {
        // Drop the intervention's Before/Midline/Endline surveys with it, so
        // they cannot linger in the surveys list or on clients' devices.
        await this.surveysService
          .deleteSurveysByInterventionId(this.interventionId)
          .catch(() => undefined);
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      () => {
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
