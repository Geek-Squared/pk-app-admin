import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.interface';
import { CategoriesService, InterventionsService } from 'src/app/services';

@Component({
  selector: 'app-feature-categories',
  templateUrl: './feature-categories.component.html',
  styleUrls: ['./feature-categories.component.scss'],
})
export class FeatureCategoriesComponent implements OnInit {
  @Input() interventionId: string;
  public isCreate = false;
  public isUpdate = false;
  public isDelete = false;
  public categories: Category[] = [];
  public isLoading = false;
  public openMenuId: string | null = null;
  public selectedCategory: Category | null = null;
  public interventionNames: Record<string, string> = {};

  constructor(
    private categoriesService: CategoriesService,
    private interventionsService: InterventionsService
  ) {}

  public interventionName(id: string): string {
    return id && this.interventionNames[id] ? this.interventionNames[id] : '';
  }

  @HostListener('document:click')
  closeMenus() {
    this.openMenuId = null;
  }

  toggleMenu(event: Event, category: Category) {
    event.stopPropagation();
    event.preventDefault();
    this.openMenuId = this.openMenuId === category.id ? null : category.id;
  }

  editCategory(event: Event, category: Category) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedCategory = category;
    this.openMenuId = null;
    this.isUpdate = true;
  }

  deleteCategory(event: Event, category: Category) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedCategory = category;
    this.openMenuId = null;
    this.isDelete = true;
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.interventionsService.getInterventions().subscribe((data) => {
      const map: Record<string, string> = {};
      data.forEach((e: any) => {
        map[e.payload.doc.id] = e.payload.doc.data()?.name;
      });
      this.interventionNames = map;
    });

    this.categoriesService.getCategories().subscribe(
      (data) => {
        const all = data.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() } as Category));
        this.categories = this.interventionId
          ? all.filter(c => c.interventionId === this.interventionId)
          : all;
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    );
  }
}
