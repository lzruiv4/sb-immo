import { fakeAsync, TestBed } from '@angular/core/testing';

import { PropertyRecordService } from './property-record.service';
import { RoleType } from '../models/enums/role.enum';
import { IPropertyRecordDto } from '../models/dtos/property-record.dto';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { NotificationService } from './notification.service';
import { BACKEND_API_PROPERTY_RECORD_URL } from '../core/apis/backend.api';
import { ContactService } from './contact.service';
import { IPropertyDto } from '../models/dtos/property.dto';
import { PropertyStatusType } from '../models/enums/property-status.enum';
import { IContactDto } from '../models/dtos/contact.dto';
import { PropertyService } from './property.service';
import { of } from 'rxjs';

describe('PropertyRecordService', () => {
  let propertyRecordService: PropertyRecordService;
  let httpMock: HttpTestingController;

  const mockContacts: IContactDto[] = [
    {
      contactId: 'c-1',
      firstname: 'c-f-1',
      lastname: 'c-l-1',
      email: 'c-e-1',
      phone: 'c-p-1',
    },
    {
      contactId: 'c-2',
      firstname: 'c-f-2',
      lastname: 'c-l-2',
      email: 'c-e-2',
      phone: 'c-p-2',
    },
  ];
  const mockProperties: IPropertyDto[] = [
    {
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
    {
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
  ];
  const mockPropertyRecordsFromDB: IPropertyRecordDto[] = [
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
  ];

  beforeEach(() => {
    const mockPropertyService = {
      properties$: of(mockProperties),
    };
    const mockContactService = {
      contacts$: of(mockContacts),
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PropertyRecordService,
        NotificationService,
        MessageService,
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: ContactService, useValue: mockContactService },
      ],
    });
    propertyRecordService = TestBed.inject(PropertyRecordService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return all property records', fakeAsync(() => {
    propertyRecordService.getPropertyRecordsFromDB();
    const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockPropertyRecordsFromDB);

    propertyRecordService.propertyRecordsFromDB$.subscribe((records) => {
      expect(records.length).toBe(2);
    });
  }));

  // it('should show error on HTTP failure', () => {
  //   const consoleSpy = spyOn(console, 'error');
  //   const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
  //   req.flush('Error', { status: 500, statusText: 'Server Error' });

  //   expect(consoleSpy).toHaveBeenCalledWith(
  //     'There is an error in the request data.',
  //     jasmine.anything() // 配合spyOn来监控console.error
  //   );
  // });

  it('should save the property record', fakeAsync(() => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    const testPropertyRecord = {
      propertyId: 'p-1',
      contactId: 'c-644',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2027-01-01'),
      endAt: new Date('2027-04-30'),
    };

    propertyRecordService
      .saveNewPropertyRecord(testPropertyRecord)
      .subscribe((pr) => expect(pr).toBe(testPropertyRecord));

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    req.flush(testPropertyRecord);

    propertyRecordService.propertyRecordsFromDB$.subscribe((prs) =>
      expect(prs).toHaveSize(3)
    );
  }));

  it('should handel error, when save the property record failed', fakeAsync(() => {
    const testPropertyRecord = {
      propertyId: 'p-1',
      contactId: 'c-644',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2027-01-01'),
      endAt: new Date('2027-04-30'),
    };

    const consoleSpy = spyOn(console, 'error');
    propertyRecordService.saveNewPropertyRecord(testPropertyRecord).subscribe({
      next: () => fail('should failed'),
      error: (error) => {
        expect(console.error).toHaveBeenCalledWith(
          'Error occurred during create new property record.'
        );
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(req.request.method).toBe('POST');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error occurred during create new property record.'
    );
  }));

  it('should update a property record', fakeAsync(() => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    const testPropertyRecord = {
      propertyRecordId: 'pr-1',
      propertyId: 'p-2',
      contactId: 'c-1',
      role: RoleType.ROLE_OWNER,
      startAt: new Date('2025-01-01'),
      endAt: new Date('2025-04-30'),
    };

    propertyRecordService
      .updatePropertyRecord(
        testPropertyRecord.propertyRecordId,
        testPropertyRecord
      )
      .subscribe((pr) => expect(pr).toBe(testPropertyRecord));

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL + '/pr-1');
    expect(req.request.method).toBe('PUT');
    req.flush(testPropertyRecord);

    propertyRecordService.propertyRecordsFromDB$.subscribe((prs) => {
      const updatePr = prs.find((pr) => pr.propertyRecordId === 'pr-1');
      expect(updatePr?.propertyId).toEqual('p-2');
      expect(updatePr?.contactId).toEqual('c-1');
    });

    propertyRecordService.propertyRecords$.subscribe((rr) => {
      const updateProperty = rr.find((pr) => pr.propertyRecordId === 'pr-1');
      expect(updateProperty?.property.propertyId).toEqual('p-2');
    });
  }));

  it('should handel error, when update a property record failed', fakeAsync(() => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    const testPropertyRecord = {
      propertyRecordId: 'unknown',
      propertyId: 'pp-1',
      contactId: 'cc-1',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2025-01-01'),
      endAt: new Date('2025-04-30'),
    };

    const consoleSpy = spyOn(console, 'error');
    propertyRecordService
      .updatePropertyRecord('unknown', testPropertyRecord)
      .subscribe({
        next: () => fail('should failed'),
        error: (error) => {
          expect(console.error).toHaveBeenCalledWith(
            'Error occurred during update a property record.'
          );
          expect(error.status).toBe(404);
        },
      });

    const req = httpMock.expectOne(
      BACKEND_API_PROPERTY_RECORD_URL + '/unknown'
    );
    expect(req.request.method).toBe('PUT');
    req.flush('Error', {
      status: 404,
      statusText: 'Property record not found',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error occurred during update a property record.'
    );
  }));

  it('should delete a property record', fakeAsync(() => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    propertyRecordService.deletePropertyRecord('pr-1').subscribe();
    const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL + '/pr-1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    propertyRecordService.propertyRecordsFromDB$.subscribe((propertyRecords) =>
      expect(propertyRecords).toHaveSize(1)
    );
  }));

  it('should handle error when save property failed', fakeAsync(() => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    const consoleSpy = spyOn(console, 'error');
    propertyRecordService.deletePropertyRecord('3').subscribe({
      next: () => fail('should failed'),
      error: (error) => {
        expect(console.error).toHaveBeenCalledWith(
          'Error occurred during delete a property record.'
        );
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL + '/3');
    expect(req.request.method).toBe('DELETE');
    req.flush('Error', {
      status: 404,
      statusText: 'Property record not found',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error occurred during delete a property record.'
    );
  }));

  it('should return null, when the start is not available', () => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    const testPropertyRecord = {
      propertyId: 'p-1',
      contactId: 'c-644',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2026-06-01'),
      endAt: new Date('2026-07-30'),
    };

    const result = propertyRecordService.getPropertyAvailabilityDate(
      testPropertyRecord,
      mockPropertyRecordsFromDB
    );

    expect(result).toEqual(new Date('2026-06-01'));
  });

  it('should return a next available date, when the start is available', () => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    const testPropertyRecord = {
      propertyId: 'p-1',
      contactId: 'c-644',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2025-04-01'),
      endAt: new Date('2025-04-30'),
    };

    const result = propertyRecordService.getPropertyAvailabilityDate(
      testPropertyRecord,
      mockPropertyRecordsFromDB
    );

    expect(result).toEqual(new Date('2025-04-30'));
  });

  it('should return a date, when the property is available', fakeAsync(() => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);
    const testPropertyRecord = {
      propertyId: 'p-1',
      contactId: 'c-644',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2025-05-01'),
      endAt: new Date('2025-05-31'),
    };

    const result = propertyRecordService.getPropertyAvailabilityDate(
      testPropertyRecord,
      mockPropertyRecordsFromDB
    );

    expect(result).toEqual(new Date('2025-05-01'));
  }));

  it('should return return true, when a property is available for a renter', () => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    const testPropertyRecord = {
      propertyRecordId: 'pr-5',
      propertyId: 'p-1',
      contactId: 'c-1',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2026-01-01'),
      endAt: new Date('2026-05-31'),
    };
    expect(
      propertyRecordService.checkPropertyRecord(testPropertyRecord)
    ).toBeTrue();
  });

  it('should return return false, when a property is not available for a renter', () => {
    propertyRecordService.getPropertyRecordsFromDB();
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockPropertyRecordsFromDB);

    const testPropertyRecord = {
      propertyRecordId: 'pr-5',
      propertyId: 'p-1',
      contactId: 'c-1',
      role: RoleType.ROLE_RENTER,
      startAt: new Date('2025-03-01'),
      endAt: new Date('2025-05-31'),
    };
    expect(
      propertyRecordService.checkPropertyRecord(testPropertyRecord)
    ).toBeFalse();
  });
});
