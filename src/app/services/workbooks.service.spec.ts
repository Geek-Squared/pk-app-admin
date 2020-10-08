import { TestBed } from '@angular/core/testing';

import { WorkbooksService } from './workbooks.service';

describe('WorkbooksService', () => {
  let service: WorkbooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkbooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
