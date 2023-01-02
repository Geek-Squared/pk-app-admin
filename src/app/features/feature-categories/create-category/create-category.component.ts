import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Category } from 'src/app/models/category.interface';
import { CategoriesService } from 'src/app/services';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {}

  onSubmit(category: Category) {
    this.buttonState = ClrLoadingState.LOADING;
    category.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.categoriesService.createCategory(category).then(
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
