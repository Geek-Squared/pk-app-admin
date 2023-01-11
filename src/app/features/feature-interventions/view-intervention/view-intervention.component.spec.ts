import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewInterventionComponent } from './view-intervention.component';

describe('ViewInterventionComponent', () => {
  let component: ViewInterventionComponent;
  let fixture: ComponentFixture<ViewInterventionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
