import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateInterventionComponent } from './create-intervention.component';

describe('CreateInterventionComponent', () => {
  let component: CreateInterventionComponent;
  let fixture: ComponentFixture<CreateInterventionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
