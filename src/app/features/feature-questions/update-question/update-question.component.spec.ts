import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateQuestionComponent } from './update-question.component';

describe('UpdateQuestionComponent', () => {
  let component: UpdateQuestionComponent;
  let fixture: ComponentFixture<UpdateQuestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
