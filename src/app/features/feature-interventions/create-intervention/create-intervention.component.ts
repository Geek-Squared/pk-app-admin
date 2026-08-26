import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Intervention } from 'src/app/models/intervention.interface';
import { Utilities } from 'src/app/models/utils';
import { InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-create-intervention',
  templateUrl: './create-intervention.component.html',
  styleUrls: ['./create-intervention.component.scss'],
})
export class CreateInterventionComponent implements OnInit {
  @Input() categoryId: string;
  @Output() closeModal = new EventEmitter();
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private interventionsService: InterventionsService) {}

  ngOnInit(): void {}

  onSubmit(intervention: Intervention) {
    this.buttonState = ClrLoadingState.LOADING;
    intervention.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.interventionsService.createIntervention(intervention).then(
      () => {
        Utilities.displayToast('success', `“${intervention.name}” created.`);
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      (error) => {
        // Silence here is worse than the failure: the modal just sits there and
        // nobody can tell whether the intervention was written or not.
        console.error('Create intervention failed', error);
        Utilities.displayToast(
          'error',
          Utilities.firestoreErrorMessage(error, 'Could not create the intervention.')
        );
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
