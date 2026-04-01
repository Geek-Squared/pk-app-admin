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
  @Input() user: any;
  @Input() title: string = 'Create User';
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public opened = true;
  public userForm: FormGroup;
  public roles = Roles;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.user) {
      this.userForm.patchValue(this.user);
      this.userForm.get('email').disable();
      this.userForm.get('email').clearValidators();
      this.userForm.get('email').updateValueAndValidity();
      this.userForm.get('password').clearValidators();
      this.userForm.get('password').updateValueAndValidity();
    }
  }

  private createForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      role: ['', Validators.required],
    });
  }
}
