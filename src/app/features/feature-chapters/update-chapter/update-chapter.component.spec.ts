import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChapterComponent } from './update-chapter.component';

describe('UpdateChapterComponent', () => {
  let component: UpdateChapterComponent;
  let fixture: ComponentFixture<UpdateChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
