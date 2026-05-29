import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';

import { Category } from 'src/app/models/category.interface';
import { Intervention } from 'src/app/models/intervention.interface';
import { InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormComponent implements OnInit {
  @Input() category: Category;
  @Input() btnState: ClrLoadingState;
  @Input() title: string;
  @Input() interventionId: string;
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public opened = true;
  public categoryForm: FormGroup;
  public interventions: Intervention[] = [];

  constructor(
    private fb: FormBuilder,
    private interventionsService: InterventionsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.category) {
      this.categoryForm.addControl('id', new FormControl(''));
      this.categoryForm.patchValue(this.category);
    } else if (this.interventionId) {
      this.categoryForm.patchValue({ interventionId: this.interventionId });
    }

    this.interventionsService.getInterventions().subscribe((data) => {
      this.interventions = data.map(
        (e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() } as Intervention)
      );
      this.cdr.markForCheck();
    });
  }

  private createForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      interventionId: ['', Validators.required],
      order: [''],
      uid: '',
    });
  }
}
