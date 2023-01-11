import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeatureCategoriesComponent } from './feature-categories.component';

describe('FeatureCategoriesComponent', () => {
  let component: FeatureCategoriesComponent;
  let fixture: ComponentFixture<FeatureCategoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
