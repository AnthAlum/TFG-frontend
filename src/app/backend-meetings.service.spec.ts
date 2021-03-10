import { TestBed } from '@angular/core/testing';

import { BackendMeetingsService } from './backend-meetings.service';

describe('BackendMeetingsService', () => {
  let service: BackendMeetingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendMeetingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
