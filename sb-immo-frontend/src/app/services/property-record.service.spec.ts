import { TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';
import { PropertyRecordService } from './property-record.service';
import { RoleType } from '../models/enums/role.enum';
import { IPropertyRecordDto } from '../models/dtos/property-record.dto';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { NotificationService } from './notification.service';

describe('PropertyRecordService', () => {
  let propertyRecordService: PropertyRecordService;
  let propertyRecords: IPropertyRecordDto[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PropertyRecordService, NotificationService, MessageService],
    });
    propertyRecordService = TestBed.inject(PropertyRecordService);

    // Mock property records
    propertyRecords = [
      {
        propertyRecordId: 'pr-1',
        propertyId: 'p-1',
        contactId: 'c-1',
        role: RoleType.ROLE_RENTER,
        startAt: new Date('2025-01-01'),
        endAt: new Date('2025-04-30'),
      },
      {
        propertyRecordId: 'pr-2',
        propertyId: 'p-1',
        contactId: 'c-2',
        role: RoleType.ROLE_RENTER,
        startAt: new Date('2025-06-01'),
        endAt: new Date('2025-09-30'),
      },
      {
        propertyRecordId: 'pr-1',
        propertyId: 'p-1',
        contactId: 'c-3',
        role: RoleType.ROLE_RENTER,
        startAt: new Date('2025-10-01'),
        endAt: new Date('2025-12-31'),
      },
      {
        propertyRecordId: 'pr-1',
        propertyId: 'p-1',
        contactId: 'c-4',
        role: RoleType.ROLE_RENTER,
        startAt: new Date('2026-06-01'),
      },
    ] as IPropertyRecordDto[];

    // simulate BehaviorSubject
    propertyRecordService['propertyRecordsSubject'] = new BehaviorSubject<
      IPropertyRecordDto[]
    >(propertyRecords);
  });

  // it('should return null, when the property is not available', () => {
  //   const testPropertyRecord = {
  //     propertyId: 'p-1',
  //     contactId: 'c-644',
  //     role: RoleType.ROLE_RENTER,
  //     startAt: new Date('2025-01-01'),
  //     endAt: new Date('2025-04-30'),
  //   };

  //   const result = propertyRecordService.getPropertyAvailabilityDate(
  //     testPropertyRecord,
  //     propertyRecords
  //   );

  //   expect(result).toBeNull;
  // });

  it('should return a date, when the property is available', () => {
    const testPropertyRecord = {
      propertyId: 'p-1',
      contactId: 'c-644',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2025-05-01'),
      endAt: new Date('2025-05-31'),
    };

    const result = propertyRecordService.getPropertyAvailabilityDate(
      testPropertyRecord,
      propertyRecords
    );

    expect(result).toEqual(new Date('2025-05-01'));
  });
});
