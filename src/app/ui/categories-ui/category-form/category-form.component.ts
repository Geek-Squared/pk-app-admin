import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';

import { Category } from 'src/app/models/category.interface';

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
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public opened = true;
  public categoryForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.category) {
      this.categoryForm.addControl('id', new FormControl(''));
      this.categoryForm.patchValue(this.category);
    }
  }

  private createForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      order: [''],
      uid: '',
    });
  }
}
