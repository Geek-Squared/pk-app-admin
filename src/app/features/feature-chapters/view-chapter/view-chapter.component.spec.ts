import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewChapterComponent } from './view-chapter.component';

describe('ViewChapterComponent', () => {
  let component: ViewChapterComponent;
  let fixture: ComponentFixture<ViewChapterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
