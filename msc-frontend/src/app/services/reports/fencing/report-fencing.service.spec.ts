import {TestBed} from '@angular/core/testing';

import {ReportFencingService} from './report-fencing.service';

describe('ReportFencingService', () => {
  let service: ReportFencingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportFencingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
