import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { CategoriesService } from 'src/app/services';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss'],
})
export class DeleteCategoryComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() categoryId: string;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.buttonState = ClrLoadingState.LOADING;
    this.categoriesService.deleteCategory(this.categoryId).then(
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
