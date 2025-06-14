import { TestBed } from '@angular/core/testing';

import { PropertyRecordService } from './connection.service';

describe('ConnectionService', () => {
  let service: PropertyRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
