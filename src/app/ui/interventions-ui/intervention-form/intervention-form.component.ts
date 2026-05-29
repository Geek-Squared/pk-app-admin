import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { UsersService } from 'src/app/services';

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

  public users: any[] = [];
  public userSearch = '';
  public selectedUserIds = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.intervention) {
      this.interventionForm.addControl('id', new FormControl(''));
      this.interventionForm.patchValue(this.intervention);
      (this.intervention.allowedUserIds || []).forEach((id) => this.selectedUserIds.add(id));
    }

    this.usersService.getUsers().subscribe((data: any[]) => {
      this.users = data.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() }));
      this.cdr.markForCheck();
    });
  }

  private createForm() {
    this.interventionForm = this.fb.group({
      name: ['', Validators.required],
      order: [''],
      uid: '',
      categoryId: '',
      visibility: ['all'],
    });
  }

  get isRestricted(): boolean {
    return this.interventionForm?.get('visibility')?.value === 'restricted';
  }

  get filteredUsers(): any[] {
    const term = this.userSearch.trim().toLowerCase();
    if (!term) {
      return this.users;
    }
    return this.users.filter(
      (u) =>
        (u.displayName || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term) ||
        (u.role || '').toLowerCase().includes(term)
    );
  }

  isSelected(uid: string): boolean {
    return this.selectedUserIds.has(uid);
  }

  toggleUser(uid: string): void {
    if (this.selectedUserIds.has(uid)) {
      this.selectedUserIds.delete(uid);
    } else {
      this.selectedUserIds.add(uid);
    }
  }

  get canSave(): boolean {
    if (this.interventionForm.invalid) {
      return false;
    }
    if (this.isRestricted && this.selectedUserIds.size === 0) {
      return false;
    }
    return true;
  }

  submit(): void {
    const value = { ...this.interventionForm.value };
    if (value.visibility === 'restricted') {
      value.allowedUserIds = Array.from(this.selectedUserIds);
    } else {
      value.visibility = 'all';
      value.allowedUserIds = [];
    }
    this.formValue.emit(value);
  }
}
