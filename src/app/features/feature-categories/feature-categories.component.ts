import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.interface';
import { CategoriesService } from 'src/app/services';

@Component({
  selector: 'app-feature-categories',
  templateUrl: './feature-categories.component.html',
  styleUrls: ['./feature-categories.component.scss'],
})
export class FeatureCategoriesComponent implements OnInit {
  @Input() interventionId: string | null = null;
  public isCreate: boolean;
  public categories: Category[];
  public isLoading: boolean;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.isLoading = true;
    const categories$ = this.interventionId
      ? this.categoriesService.getCategoriesByInterventionId(
          this.interventionId
        )
      : this.categoriesService.getCategories();

    categories$.subscribe(
      (data) => {
        this.categories = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as Category;
        });
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
