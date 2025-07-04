import {TestBed} from '@angular/core/testing';

import {SemesterSettingsService} from './semester-settings.service';

describe('ReportChangeService', () => {
  let service: SemesterSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemesterSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
