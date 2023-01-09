import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkbookDetailsComponent } from './workbook-details.component';

describe('WorkbookDetailsComponent', () => {
  let component: WorkbookDetailsComponent;
  let fixture: ComponentFixture<WorkbookDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbookDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
