import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Intervention } from 'src/app/models/intervention.interface';
import { Utilities } from 'src/app/models/utils';
import { InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-update-intervention',
  templateUrl: './update-intervention.component.html',
  styleUrls: ['./update-intervention.component.scss']
})
export class UpdateInterventionComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() intervention: Intervention;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private interventionsService: InterventionsService) {}

  ngOnInit(): void {}

  onSubmit(intervention: Intervention) {
    this.buttonState = ClrLoadingState.LOADING;
    this.interventionsService.updateIntervention(intervention).then(
      () => {
        Utilities.displayToast('success', 'Changes saved.');
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      (error) => {
        console.error('Update intervention failed', error);
        Utilities.displayToast(
          'error',
          Utilities.firestoreErrorMessage(error, 'Could not save the changes.')
        );
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
