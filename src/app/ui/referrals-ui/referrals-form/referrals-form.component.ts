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

import { Referral } from 'src/app/models/referral.interface';

@Component({
  selector: 'app-referrals-form',
  templateUrl: './referrals-form.component.html',
  styleUrls: ['./referrals-form.component.scss'],
})
export class ReferralsFormComponent implements OnInit {
  @Input() referral: Referral;
  @Input() btnState: ClrLoadingState;
  @Input() title: string;
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public opened = true;
  public referralForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.referral) {
      this.referralForm.addControl('id', new FormControl(''));
      this.referralForm.patchValue(this.referral);
    }
  }

  private createForm() {
    this.referralForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      order: [''],
      uid: '',
    });
  }
}
