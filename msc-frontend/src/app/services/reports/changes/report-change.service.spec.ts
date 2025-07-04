import {TestBed} from '@angular/core/testing';

import {ReportChangeService} from './report-change.service';

describe('ReportChangeService', () => {
  let service: ReportChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
