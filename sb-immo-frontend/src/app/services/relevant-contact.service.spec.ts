import { TestBed } from '@angular/core/testing';

import { RelevantContactService } from './relevant-contact.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';
import { ContactService } from './contact.service';
import { PropertyRecordService } from './property-record.service';
import { of } from 'rxjs';
import { RoleType } from '../models/enums/role.enum';
import { IPropertyRecord } from '../models/property-record.model';
import { PropertyStatusType } from '../models/enums/property-status.enum';

describe('RelevantContactService', () => {
  let service: RelevantContactService;
  let mockPropertyRecordService: jasmine.SpyObj<PropertyRecordService>;

  const mockPropertyRecords: IPropertyRecord[] = [
    {
      propertyRecordId: 'pr-1',
      property: {
        propertyId: 'p-1',
        propertyName: 'pn-1',
        address: {
          street: 'p-s-1',
          houseNumber: 'p-h-1',
          postcode: 'p-p-1',
          city: 'p-c-1',
          country: 'p-co-1',
          countryCode: 'p-cou-1',
        },
        unit: '',
        area: 120,
        buildYear: 2000,
        status: PropertyStatusType.AVAILABLE,
      },
      contact: {
        contactId: 'c-1',
        firstname: 'c-f-1',
        lastname: 'c-l-1',
        email: 'c-e-1',
        phone: 'c-p-1',
      },
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2025-01-01'),
      endAt: new Date('2025-04-30'),
    },
    {
      propertyRecordId: 'pr-2',
      property: {
        propertyId: 'p-2',
        propertyName: 'pn-2',
        address: {
          street: 'p-s-2',
          houseNumber: 'p-h-2',
          postcode: 'p-p-2',
          city: 'p-c-2',
          country: 'p-co-2',
          countryCode: 'p-cou-2',
        },
        unit: '',
        area: 110,
        buildYear: 2001,
        status: PropertyStatusType.AVAILABLE,
      },
      contact: {
        contactId: 'c-2',
        firstname: 'c-f-2',
        lastname: 'c-l-2',
        email: 'c-e-2',
        phone: 'c-p-2',
      },
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2025-06-01'),
      endAt: new Date('2025-09-30'),
    },
    {
      propertyRecordId: 'pr-3',
      property: {
        propertyId: 'p-1',
        propertyName: 'pn-1',
        address: {
          street: 'p-s-1',
          houseNumber: 'p-h-1',
          postcode: 'p-p-1',
          city: 'p-c-1',
          country: 'p-co-1',
          countryCode: 'p-cou-1',
        },
        unit: '',
        area: 120,
        buildYear: 2000,
        status: PropertyStatusType.AVAILABLE,
      },
      contact: {
        contactId: 'c-3',
        firstname: 'c-f-3',
        lastname: 'c-l-3',
        email: 'c-e-3',
        phone: 'c-p-3',
      },
      role: RoleType.ROLE_SERVICE,
      startAt: new Date('2025-03-01'),
      endAt: new Date('2025-04-30'),
    },
    {
      propertyRecordId: 'pr-4',
      property: {
        propertyId: 'p-1',
        propertyName: 'pn-1',
        address: {
          street: 'p-s-1',
          houseNumber: 'p-h-1',
          postcode: 'p-p-1',
          city: 'p-c-1',
          country: 'p-co-1',
          countryCode: 'p-cou-1',
        },
        unit: '',
        area: 120,
        buildYear: 2000,
        status: PropertyStatusType.AVAILABLE,
      },
      contact: {
        contactId: 'c-4',
        firstname: 'c-f-4',
        lastname: 'c-l-4',
        email: 'c-e-4',
        phone: 'c-p-4',
      },
      role: RoleType.ROLE_OWNER,
      startAt: new Date('2025-01-01'),
    },
  ];

  beforeEach(() => {
    mockPropertyRecordService = jasmine.createSpyObj(
      'PropertyRecordService',
      [],
      {
        propertyRecords$: of(mockPropertyRecords),
      }
    );
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationService,
        MessageService,
        RelevantContactService,
        { provide: PropertyRecordService, useValue: mockPropertyRecordService },
      ],
    });
    service = TestBed.inject(RelevantContactService);
  });

  it('should return relevant contacts for a given contactId', () => {
    service
      .getRelevantPropertyRecordsByContactId('c-4')
      .subscribe((resultMap) => {
        expect(resultMap.size).toBe(1);

        const record = Array.from(resultMap.keys())[0];
        const relevant = resultMap.get(record)!;

        expect(relevant.owners.length).toBe(0);
        expect(relevant.renters.length).toBe(1);
        expect(relevant.renters[0].contact.contactId).toBe('c-1');
        expect(relevant.serviceProviders.length).toBe(1);
        expect(relevant.serviceProviders[0].contact.contactId).toBe('c-3');
      });
  });
});
