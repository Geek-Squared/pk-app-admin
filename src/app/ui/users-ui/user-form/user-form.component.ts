import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';
import { Roles } from '../../../models/roles';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  @Input() btnState: ClrLoadingState;
  @Input() title = 'Create user';
  @Input() user: any;
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public opened = true;
  public userForm: FormGroup;
  public roles = Roles;

  constructor(private fb: FormBuilder) {}

  get isEdit(): boolean {
    return !!this.user;
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      role: ['', Validators.required],
    });

    if (this.isEdit) {
      // Email and password are managed in Firebase Auth and cannot be edited here.
      this.userForm.removeControl('password');
      this.userForm.get('email').disable();
      this.userForm.patchValue({
        email: this.user.email,
        displayName: this.user.displayName,
        role: this.user.role,
      });
    }
  }

  emitValue() {
    this.formValue.emit({ ...this.user, ...this.userForm.getRawValue() });
  }
}
