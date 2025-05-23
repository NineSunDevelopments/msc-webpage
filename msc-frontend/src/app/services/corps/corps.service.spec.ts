import { TestBed } from '@angular/core/testing';

import { CorpsService } from './corps.service';

describe('CorpsService', () => {
  let service: CorpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
