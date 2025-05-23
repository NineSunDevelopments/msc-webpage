import { TestBed } from '@angular/core/testing';
import { ApiService } from '@core/services/api.ts/api.ts.service';
import { AppService } from '@core/services/app/app.service';
import { ApiMockService } from '@test-helper/mocks/api.ts.mock-service';
import { AppMockService } from '@test-helper/mocks/app.mock-service';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
        {provide: ApiService, useClass: ApiMockService},
        {provide: AppService, useClass: AppMockService},
      ]});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
