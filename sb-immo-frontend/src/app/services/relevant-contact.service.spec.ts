import { TestBed } from '@angular/core/testing';

import { RelevantContactService } from './relevant-contact.service';

describe('RelevantContactService', () => {
  let service: RelevantContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelevantContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
