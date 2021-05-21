import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInterventionsComponent } from './list-interventions.component';

describe('ListInterventionsComponent', () => {
  let component: ListInterventionsComponent;
  let fixture: ComponentFixture<ListInterventionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInterventionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
