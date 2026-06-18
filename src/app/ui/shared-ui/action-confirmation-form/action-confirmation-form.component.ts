import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-action-confirmation-form',
  templateUrl: './action-confirmation-form.component.html',
  styleUrls: ['./action-confirmation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionConfirmationFormComponent implements OnInit {
  @Input() btnState$: Observable<ClrLoadingState>;
  @Input() confirmLabel = 'Delete';
  @Output() proceed = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public opened = true;

  constructor() {}

  ngOnInit(): void {}
}
