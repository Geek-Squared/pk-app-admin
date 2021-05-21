import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';

import { Intervention } from 'src/app/models/intervention.interface';

@Component({
  selector: 'app-intervention-form',
  templateUrl: './intervention-form.component.html',
  styleUrls: ['./intervention-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionFormComponent implements OnInit {
  @Input() intervention: Intervention;
  @Input() btnState: ClrLoadingState;
  @Input() title: string;
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public opened = true;
  public interventionForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.intervention) {
      this.interventionForm.addControl('id', new FormControl(''));
      this.interventionForm.patchValue(this.intervention);
    }
  }

  private createForm() {
    this.interventionForm = this.fb.group({
      name: ['', Validators.required],
      order: [''],
      uid: '',
    });
  }
}
