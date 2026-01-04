import { TestBed } from '@angular/core/testing';

import { BallTicketService } from './ball-ticket.service';

describe('BallTicketService', () => {
  let service: BallTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BallTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
