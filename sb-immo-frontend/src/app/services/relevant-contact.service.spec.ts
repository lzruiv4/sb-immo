import { TestBed } from '@angular/core/testing';

import { RelevantContactService } from './relevant-contact.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';

describe('RelevantContactService', () => {
  let service: RelevantContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService, MessageService],
    });
    service = TestBed.inject(RelevantContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
