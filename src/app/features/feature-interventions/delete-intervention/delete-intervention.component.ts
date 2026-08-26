import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Utilities } from 'src/app/models/utils';
import { InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-delete-intervention',
  templateUrl: './delete-intervention.component.html',
  styleUrls: ['./delete-intervention.component.scss'],
})
export class DeleteInterventionComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() interventionId: string;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private interventionsService: InterventionsService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.buttonState = ClrLoadingState.LOADING;
    // Only the intervention goes. Its surveys are shared instruments that other
    // interventions may also administer, so they are deliberately left alone —
    // the attachment disappears with the document that held it.
    this.interventionsService.deleteIntervention(this.interventionId).then(
      () => {
        Utilities.displayToast('success', 'Intervention deleted.');
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      (error) => {
        console.error('Delete intervention failed', error);
        Utilities.displayToast(
          'error',
          Utilities.firestoreErrorMessage(error, 'Could not delete the intervention.')
        );
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
