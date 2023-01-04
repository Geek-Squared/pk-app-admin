import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.interface';
import { CategoriesService } from 'src/app/services';

@Component({
  selector: 'app-feature-categories',
  templateUrl: './feature-categories.component.html',
  styleUrls: ['./feature-categories.component.scss'],
})
export class FeatureCategoriesComponent implements OnInit {
  public isCreate: boolean;
  public categories: Category[];
  public isLoading: boolean;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.categoriesService.getCategories().subscribe(
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
