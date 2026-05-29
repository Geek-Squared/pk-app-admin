import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
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
    this.interventionsService.deleteIntervention(this.interventionId).then(
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
