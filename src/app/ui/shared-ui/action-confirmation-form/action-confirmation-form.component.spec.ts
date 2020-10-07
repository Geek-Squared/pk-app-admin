import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionConfirmationFormComponent } from './action-confirmation-form.component';

describe('ActionConfirmationFormComponent', () => {
  let component: ActionConfirmationFormComponent;
  let fixture: ComponentFixture<ActionConfirmationFormComponent>;

  beforeEach(async(() => {
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
