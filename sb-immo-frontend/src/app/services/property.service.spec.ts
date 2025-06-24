import { fakeAsync, TestBed } from '@angular/core/testing';

import { PropertyService } from './property.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { IPropertyDto } from '../models/dtos/property.dto';
import { PropertyStatusType } from '../models/enums/property-status.enum';
import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';
import { BACKEND_API_PROPERTY_URL } from '../core/apis/backend.api';

describe('PropertyService', () => {
  let service: PropertyService;
  let httpMock: HttpTestingController;
  const mockProperties: IPropertyDto[] = [
    {
      propertyId: '1',
      propertyName: 'A',
      address: {
        addressId: 1,
        street: 'street-a',
        houseNumber: 'h-a',
        postcode: 'p-a',
        city: 'c-a',
        country: 'country-a',
        countryCode: 'CA',
      },
      unit: '',
      area: 111,
      buildYear: 1990,
      status: PropertyStatusType.AVAILABLE,
    },
    {
      propertyId: '2',
      propertyName: 'B',
      address: {
        addressId: 2,
        street: 'street-b',
        houseNumber: 'h-b',
        postcode: 'p-b',
        city: 'c-b',
        country: 'country-b',
        countryCode: 'CB',
      },
      unit: '',
      area: 111,
      buildYear: 1990,
      status: PropertyStatusType.AVAILABLE,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PropertyService, NotificationService, MessageService],
    });
    service = TestBed.inject(PropertyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be fetch data with 2 properties', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockProperties);

    service.properties$.subscribe((properties) => {
      expect(properties.length).toBe(2);
    });
  }));

  it('should check the property duplicated', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockProperties);

    const checkDuplicatedAddress = {
      propertyId: '3',
      propertyName: 'C',
      address: {
        addressId: 1,
        street: 'street-a',
        houseNumber: 'h-a',
        postcode: 'p-a',
        city: 'c-a',
        country: 'country-a',
        countryCode: 'CA',
      },
      unit: '',
      area: 111,
      buildYear: 1990,
      status: PropertyStatusType.AVAILABLE,
    };

    expect(service.isPropertyDuplicated(checkDuplicatedAddress)).toBeTrue();

    const checkNormalAddress = {
      propertyId: '2',
      propertyName: 'C',
      address: {
        addressId: 3,
        street: 'street-c',
        houseNumber: 'h-c',
        postcode: 'p-c',
        city: 'c-c',
        country: 'country-c',
        countryCode: 'CC',
      },
      unit: '',
      area: 111,
      buildYear: 1990,
      status: PropertyStatusType.AVAILABLE,
    };

    expect(service.isPropertyDuplicated(checkNormalAddress)).toBeFalse();
  }));

  it('should save a new property', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockProperties);

    const newPropertyDto = {
      propertyId: '3',
      propertyName: 'C',
      address: {
        addressId: 3,
        street: 'street-c',
        houseNumber: 'h-c',
        postcode: 'p-c',
        city: 'c-c',
        country: 'country-c',
        countryCode: 'CC',
      },
      unit: '',
      area: 111,
      buildYear: 1990,
      status: PropertyStatusType.AVAILABLE,
    };

    service.saveNewProperty(newPropertyDto).subscribe((response) => {
      expect(response).toBe(newPropertyDto);
    });

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(req.request.method).toBe('POST');
    req.flush(newPropertyDto);

    service.properties$.subscribe((properties) => {
      expect(properties.length).toBe(3);
      const result = properties.find((property) => property.propertyId === '3');
      expect(result?.propertyName).toContain('C');
      expect(result?.status).toContain(PropertyStatusType.AVAILABLE);
    });
  }));

  it('should handle error when update property failed', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockProperties);
    const newPropertyDtoWithoutPropertyId = {
      propertyName: 'C',
      address: {
        addressId: 3,
        street: 'street-c',
        houseNumber: 'h-c',
        postcode: 'p-c',
        city: 'c-c',
        country: 'country-c',
        countryCode: 'CC',
      },
      unit: '',
      area: 111,
      buildYear: 1990,
      status: PropertyStatusType.AVAILABLE,
    };

    const consoleSpy = spyOn(console, 'error');
    let mockError: any;
    service.saveNewProperty(newPropertyDtoWithoutPropertyId).subscribe({
      next: () => fail('should failed'),
      error: (error) => (mockError = error),
    });

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(req.request.method).toBe('POST');
    req.flush(
      { message: 'Property create failed' },
      { status: 500, statusText: 'Property create failed' }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error occurred during create new property.'
    );
  }));

  it('should update a property', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockProperties);

    const updateProperty = {
      propertyId: '1',
      propertyName: 'AA',
      address: {
        addressId: 1,
        street: 'street-a',
        houseNumber: 'h-a',
        postcode: 'p-a',
        city: 'c-a',
        country: 'country-a',
        countryCode: 'CA',
      },
      unit: '',
      area: 222,
      buildYear: 1990,
      status: PropertyStatusType.AVAILABLE,
    };

    service
      .updateProperty(updateProperty)
      .subscribe((property) => expect(property).toBe(updateProperty));
    const req = httpMock.expectOne(BACKEND_API_PROPERTY_URL + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updateProperty);

    service.properties$.subscribe((properties) => {
      const propertyUpdated = properties.find((pro) => pro.propertyId === '1');
      expect(propertyUpdated?.propertyName).toBe('AA');
      expect(propertyUpdated?.area).toBe(222);
    });
  }));

  it('should handle error when save property failed', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockProperties);

    const updatePropertyWithFailedPropertyId = {
      propertyId: 'unknown',
      propertyName: 'AA',
      address: {
        addressId: 1,
        street: 'street-a',
        houseNumber: 'h-a',
        postcode: 'p-a',
        city: 'c-a',
        country: 'country-a',
        countryCode: 'CA',
      },
      unit: '',
      area: 222,
      buildYear: 1990,
      status: PropertyStatusType.AVAILABLE,
    };

    const consoleSpy = spyOn(console, 'error');
    let mockError: any;
    service.updateProperty(updatePropertyWithFailedPropertyId).subscribe({
      next: () => fail('should failed'),
      error: (error) => (mockError = error),
    });

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_URL + '/unknown');
    expect(req.request.method).toBe('PUT');
    req.flush(
      { message: 'Property update failed' },
      { status: 404, statusText: 'Property not found' }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'UPDATE_PROPERTY: Error occurred during update a property.'
    );
  }));

  it('should delete a property', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockProperties);

    service.deleteProperty('2').subscribe();
    const req = httpMock.expectOne(BACKEND_API_PROPERTY_URL + '/2');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    service.properties$.subscribe((properties) =>
      expect(properties.length).toBe(1)
    );
  }));

  it('should handle error when save property failed', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_PROPERTY_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockProperties);

    const consoleSpy = spyOn(console, 'error');
    let mockError: any;
    service.deleteProperty('3').subscribe({
      next: () => fail('should failed'),
      error: (error) => (mockError = error),
    });

    const req = httpMock.expectOne(BACKEND_API_PROPERTY_URL + '/3');
    expect(req.request.method).toBe('DELETE');
    req.flush(
      { message: 'Property update failed' },
      { status: 404, statusText: 'Property not found' }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error occurred during delete a property.'
    );
  }));
});
