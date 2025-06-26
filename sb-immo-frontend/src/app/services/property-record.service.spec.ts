// import { fakeAsync, TestBed } from '@angular/core/testing';

// import { PropertyRecordService } from './property-record.service';
// import { RoleType } from '../models/enums/role.enum';
// import { IPropertyRecordDto } from '../models/dtos/property-record.dto';
// import {
//   HttpClientTestingModule,
//   HttpTestingController,
// } from '@angular/common/http/testing';
// import { MessageService } from 'primeng/api';
// import { NotificationService } from './notification.service';
// import { BACKEND_API_PROPERTY_RECORD_URL } from '../core/apis/backend.api';

// describe('PropertyRecordService', () => {
//   let propertyRecordService: PropertyRecordService;
//   let httpMock: HttpTestingController;
//   let mockPropertyRecords: IPropertyRecordDto[];

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [PropertyRecordService, NotificationService, MessageService],
//     });
//     propertyRecordService = TestBed.inject(PropertyRecordService);
//     httpMock = TestBed.inject(HttpTestingController);

//     // Mock property records
//     mockPropertyRecords = [
//       {
//         propertyRecordId: 'pr-1',
//         propertyId: 'p-1',
//         contactId: 'c-1',
//         role: RoleType.ROLE_RENTER,
//         startAt: new Date('2025-01-01'),
//         endAt: new Date('2025-04-30'),
//       },
//       {
//         propertyRecordId: 'pr-2',
//         propertyId: 'p-1',
//         contactId: 'c-2',
//         role: RoleType.ROLE_RENTER,
//         startAt: new Date('2025-06-01'),
//         endAt: new Date('2025-09-30'),
//       },
//       {
//         propertyRecordId: 'pr-3',
//         propertyId: 'p-1',
//         contactId: 'c-3',
//         role: RoleType.ROLE_RENTER,
//         startAt: new Date('2025-10-01'),
//         endAt: new Date('2025-12-31'),
//       },
//       {
//         propertyRecordId: 'pr-4',
//         propertyId: 'p-1',
//         contactId: 'c-4',
//         role: RoleType.ROLE_RENTER,
//         startAt: new Date('2026-06-01'),
//       },
//     ] as IPropertyRecordDto[];
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should return all property records', fakeAsync(() => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     propertyRecordService.propertyRecordsFromDB$.subscribe((prs) =>
//       expect(prs).toHaveSize(4)
//     );
//   }));

//   it('should save the property record', fakeAsync(() => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const testPropertyRecord = {
//       propertyId: 'p-1',
//       contactId: 'c-644',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2027-01-01'),
//       endAt: new Date('2027-04-30'),
//     };

//     propertyRecordService
//       .saveNewPropertyRecord(testPropertyRecord)
//       .subscribe((pr) => expect(pr).toBe(testPropertyRecord));

//     const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     req.flush(testPropertyRecord);

//     propertyRecordService.propertyRecordsFromDB$.subscribe((prs) =>
//       expect(prs).toHaveSize(5)
//     );
//   }));

//   it('should handel error, when save the property record failed', fakeAsync(() => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const testPropertyRecord = {
//       propertyId: 'p-1',
//       contactId: 'c-644',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2027-01-01'),
//       endAt: new Date('2027-04-30'),
//     };

//     const consoleSpy = spyOn(console, 'error');
//     let mockError: any;
//     propertyRecordService.saveNewPropertyRecord(testPropertyRecord).subscribe({
//       next: () => fail('should failed'),
//       error: (error) => (mockError = error),
//     });

//     const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(req.request.method).toBe('POST');
//     req.flush(
//       { message: 'Property record create failed' },
//       { status: 500, statusText: 'Property record create failed' }
//     );

//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Error occurred during create new property record.'
//     );
//   }));

//   it('should update a property record', fakeAsync(() => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const testPropertyRecord = {
//       propertyRecordId: 'pr-1',
//       propertyId: 'pp-1',
//       contactId: 'cc-1',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2025-01-01'),
//       endAt: new Date('2025-04-30'),
//     };

//     propertyRecordService
//       .updatePropertyRecord('pr-1', testPropertyRecord)
//       .subscribe((pr) => expect(pr).toBe(testPropertyRecord));

//     const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL + '/pr-1');
//     expect(req.request.method).toBe('PUT');
//     req.flush(testPropertyRecord);

//     propertyRecordService.propertyRecordsFromDB$.subscribe((prs) => {
//       const updatePr = prs.find((pr) => pr.propertyRecordId === 'pr-1');
//       expect(updatePr?.propertyId).toEqual('pp-1');
//       expect(updatePr?.contactId).toEqual('cc-1');
//     });
//   }));

//   it('should handel error, when update a property record failed', fakeAsync(() => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const testPropertyRecord = {
//       propertyRecordId: 'unknown',
//       propertyId: 'pp-1',
//       contactId: 'cc-1',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2025-01-01'),
//       endAt: new Date('2025-04-30'),
//     };

//     const consoleSpy = spyOn(console, 'error');
//     let mockError: any;
//     propertyRecordService
//       .updatePropertyRecord('unknown', testPropertyRecord)
//       .subscribe({
//         next: () => fail('should failed'),
//         error: (error) => (mockError = error),
//       });

//     const req = httpMock.expectOne(
//       BACKEND_API_PROPERTY_RECORD_URL + '/unknown'
//     );
//     expect(req.request.method).toBe('PUT');
//     req.flush(
//       { message: 'Property record not found' },
//       { status: 404, statusText: 'Property record not found' }
//     );

//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Error occurred during update a property record.'
//     );
//   }));

//   it('should delete a property record', fakeAsync(() => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     propertyRecordService.deletePropertyRecord('pr-1').subscribe();
//     const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL + '/pr-1');
//     expect(req.request.method).toBe('DELETE');
//     req.flush(null);
//     propertyRecordService.propertyRecordsFromDB$.subscribe((propertyRecords) =>
//       expect(propertyRecords).toHaveSize(3)
//     );
//   }));

//   it('should handle error when save property failed', fakeAsync(() => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const consoleSpy = spyOn(console, 'error');
//     let mockError: any;
//     propertyRecordService.deletePropertyRecord('3').subscribe({
//       next: () => fail('should failed'),
//       error: (error) => (mockError = error),
//     });

//     const req = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL + '/3');
//     expect(req.request.method).toBe('DELETE');
//     req.flush(
//       { message: 'Property record delete failed' },
//       { status: 404, statusText: 'Property record not found' }
//     );

//     expect(consoleSpy).toHaveBeenCalledWith(
//       'Error occurred during delete a property record.'
//     );
//   }));

//   it('should return null, when the start is not available', () => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const testPropertyRecord = {
//       propertyId: 'p-1',
//       contactId: 'c-644',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2026-06-01'),
//       endAt: new Date('2026-07-30'),
//     };

//     const result = propertyRecordService.getPropertyAvailabilityDate(
//       testPropertyRecord,
//       mockPropertyRecords
//     );

//     expect(result).toBeNull();
//   });

//   it('should return a next available date, when the start is available', () => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const testPropertyRecord = {
//       propertyId: 'p-1',
//       contactId: 'c-644',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2025-04-01'),
//       endAt: new Date('2025-04-30'),
//     };

//     const result = propertyRecordService.getPropertyAvailabilityDate(
//       testPropertyRecord,
//       mockPropertyRecords
//     );

//     expect(result).toEqual(new Date('2025-04-30'));
//   });

//   it('should return a date, when the property is available', fakeAsync(() => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);
//     const testPropertyRecord = {
//       propertyId: 'p-1',
//       contactId: 'c-644',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2025-05-01'),
//       endAt: new Date('2025-05-31'),
//     };

//     const result = propertyRecordService.getPropertyAvailabilityDate(
//       testPropertyRecord,
//       mockPropertyRecords
//     );

//     expect(result).toEqual(new Date('2025-05-01'));
//   }));

//   it('should return return true, when a property is available for a renter', () => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const testPropertyRecord = {
//       propertyRecordId: 'pr-5',
//       propertyId: 'p-1',
//       contactId: 'c-1',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2026-01-01'),
//       endAt: new Date('2026-05-31'),
//     };
//     expect(
//       propertyRecordService.checkPropertyRecord(testPropertyRecord)
//     ).toBeTrue();
//   });

//   it('should return return false, when a property is not available for a renter', () => {
//     const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_RECORD_URL);
//     expect(initReq.request.method).toBe('GET');
//     initReq.flush(mockPropertyRecords);

//     const testPropertyRecord = {
//       propertyRecordId: 'pr-5',
//       propertyId: 'p-1',
//       contactId: 'c-1',
//       role: RoleType.ROLE_RENTER,
//       startAt: new Date('2026-06-01'),
//       endAt: new Date('2026-07-31'),
//     };
//     expect(
//       propertyRecordService.checkPropertyRecord(testPropertyRecord)
//     ).toBeFalse();
//   });
// });
