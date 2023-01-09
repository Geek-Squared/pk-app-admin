import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionConfirmationFormComponent } from './action-confirmation-form.component';

describe('ActionConfirmationFormComponent', () => {
  let component: ActionConfirmationFormComponent;
  let fixture: ComponentFixture<ActionConfirmationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionConfirmationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionConfirmationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
