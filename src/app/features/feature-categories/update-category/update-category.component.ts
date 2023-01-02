import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Category } from 'src/app/models/category.interface';
import { CategoriesService } from 'src/app/services';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() category: Category;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {}

  onSubmit(category: Category) {
    this.buttonState = ClrLoadingState.LOADING;
    this.categoriesService.updateCategory(category).then(
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
