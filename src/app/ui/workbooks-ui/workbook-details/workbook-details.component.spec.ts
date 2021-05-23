import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbookDetailsComponent } from './workbook-details.component';

describe('WorkbookDetailsComponent', () => {
  let component: WorkbookDetailsComponent;
  let fixture: ComponentFixture<WorkbookDetailsComponent>;

  beforeEach(async(() => {
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
