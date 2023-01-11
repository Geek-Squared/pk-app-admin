import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListChaptersComponent } from './list-chapters.component';

describe('ListChaptersComponent', () => {
  let component: ListChaptersComponent;
  let fixture: ComponentFixture<ListChaptersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChaptersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
