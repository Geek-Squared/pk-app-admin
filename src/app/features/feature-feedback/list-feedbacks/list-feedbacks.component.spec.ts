import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFeedbacksComponent } from './list-feedbacks.component';

describe('ListFeedbacksComponent', () => {
  let component: ListFeedbacksComponent;
  let fixture: ComponentFixture<ListFeedbacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFeedbacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
