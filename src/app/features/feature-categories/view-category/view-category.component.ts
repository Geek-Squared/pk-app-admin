import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category.interface';
import { CategoriesService } from 'src/app/services';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss'],
})
export class ViewCategoryComponent implements OnInit {
  public category$ = this.categoriesService.getCategoryById(
    this.route.snapshot.paramMap.get('categoryId')
  );
  public isUpdate: boolean;
  public selectedCategory: Category;

  constructor(
    public route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private location: Location
  ) {}

  ngOnInit(): void {}

  updateCategory(category) {
    this.selectedCategory = category;
    this.isUpdate = true;
  }

  goBack(): void {
    this.location.back();
  }
}
