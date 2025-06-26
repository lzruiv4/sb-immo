import { TestBed } from '@angular/core/testing';

import { RelevantContactService } from './relevant-contact.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';
import { ContactService } from './contact.service';
import { PropertyRecordService } from './property-record.service';
import { of } from 'rxjs';
import { RoleType } from '../models/enums/role.enum';

describe('RelevantContactService', () => {
  let service: RelevantContactService;
  let mockContactService: jasmine.SpyObj<ContactService>;
  let mockPropertyRecordService: jasmine.SpyObj<PropertyRecordService>;

  beforeEach(() => {
    mockContactService = jasmine.createSpyObj('ContactService', ['contacts$'], {
      contacts$: of([
        { contactId: '1', firstname: 'A' },
        { contactId: '2', firstname: 'B' },
        { contactId: '3', firstname: 'C' },
      ]),
    });

    mockPropertyRecordService = jasmine.createSpyObj(
      'PropertyRecordService',
      ['getPropertyRecords'],
      {
        propertyRecords$: of([
          { contactId: '1', propertyId: 'p1', role: RoleType.ROLE_OWNER },
          { contactId: '2', propertyId: 'p1', role: RoleType.ROLE_RENTER },
          { contactId: '3', propertyId: 'p1', role: RoleType.ROLE_SERVICE },
        ]),
      }
    );
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationService,
        MessageService,
        RelevantContactService,
        { provide: ContactService, useValue: mockContactService },
        { provide: PropertyRecordService, useValue: mockPropertyRecordService },
      ],
    });
    service = TestBed.inject(RelevantContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should return relevant contacts grouped by role', (done) => {
  //   service.getRelevantContactByContactId('1').subscribe((result) => {
  //     expect(result.contact.contactId).toBe('1');
  //     expect(result.owners.length).toBe(0); // self is owner, excluded
  //     expect(result.renters.length).toBe(1);
  //     expect(result.renters[0].contactId).toBe('2');
  //     expect(result.serviceProviders.length).toBe(1);
  //     expect(result.serviceProviders[0].contactId).toBe('3');
  //     done();
  //   });
  // });

  // it('should return empty response when contact is not found', (done) => {
  //   mockContactService.contacts$ = of([
  //     {
  //       contactId: '2',
  //       firstname: 'B',
  //       lastname: 'test',
  //       email: 'test@test.test',
  //       phone: '123456',
  //     },
  //     {
  //       contactId: '3',
  //       firstname: 'C',
  //       lastname: 'test',
  //       email: 'test1@test.test',
  //       phone: '1234567',
  //     },
  //   ]);

  //   service.getRelevantContactByContactId('4').subscribe((result) => {
  //     expect(result.contact.contactId).toBe('4');
  //     expect(result.contact.firstname).toBe('');
  //     expect(result.owners.length).toBe(0);
  //     done();
  //   });
  // });

  // it('should categorize contact IDs correctly by role', (done) => {
  //   service.getRelevantContactIdsByContactId('1').subscribe((result) => {
  //     expect(result.ownerIds.length).toBe(0); // self is owner
  //     expect(result.renterIds).toEqual(['2']);
  //     expect(result.serviceProviderIds).toEqual(['3']);
  //     done();
  //   });
  // });
});
