import {TestBed} from '@angular/core/testing';

import {ReportSemesterService} from './report-semester.service';

describe('ReportSemesterService', () => {
  let service: ReportSemesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportSemesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
