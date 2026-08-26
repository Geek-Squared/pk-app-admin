import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Intervention } from 'src/app/models/intervention.interface';
import { InterventionsService, SurveysService } from 'src/app/services';

@Component({
  selector: 'app-update-intervention',
  templateUrl: './update-intervention.component.html',
  styleUrls: ['./update-intervention.component.scss']
})
export class UpdateInterventionComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() intervention: Intervention;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(
    private interventionsService: InterventionsService,
    private surveysService: SurveysService
  ) {}

  ngOnInit(): void {}

  onSubmit(intervention: Intervention) {
    const previousName = this.intervention?.name;
    this.buttonState = ClrLoadingState.LOADING;
    this.interventionsService.updateIntervention(intervention).then(
      async () => {
        if (previousName && previousName !== intervention.name) {
          await this.surveysService
            .syncInterventionName(intervention, previousName)
            .catch(() => undefined);
        }
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      () => {
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
