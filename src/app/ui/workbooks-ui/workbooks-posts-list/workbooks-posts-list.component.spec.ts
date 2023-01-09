import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkbooksPostsListComponent } from './workbooks-posts-list.component';

describe('WorkbooksPostsListComponent', () => {
  let component: WorkbooksPostsListComponent;
  let fixture: ComponentFixture<WorkbooksPostsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbooksPostsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbooksPostsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
