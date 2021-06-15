import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsFormComponent } from './referrals-form.component';

describe('ReferralsFormComponent', () => {
  let component: ReferralsFormComponent;
  let fixture: ComponentFixture<ReferralsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
