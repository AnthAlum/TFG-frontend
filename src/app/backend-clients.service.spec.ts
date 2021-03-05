import { TestBed } from '@angular/core/testing';

import { BackendClientsService } from './backend-clients.service';

describe('BackendClientsService', () => {
  let service: BackendClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
