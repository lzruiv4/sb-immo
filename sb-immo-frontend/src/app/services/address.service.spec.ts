import { TestBed } from '@angular/core/testing';
import { AddressService } from './address.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GEO_API_URL, GEO_RESPONSE_LIMIT } from '../core/apis/geo.api';
import { IAddressDto } from '../models/dtos/address.dto';
import { BACKEND_API_ADDRESS_URL } from '../core/apis/backend.api';

describe('AddressService', () => {
  let service: AddressService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService],
    });

    service = TestBed.inject(AddressService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handel error when server is offline', () => {
    const inputValue = 'Berlin';
    const consoleSpy = spyOn(console, 'error');
    let mockError: any;
    service.getAddressesForInput(inputValue).subscribe({
      next: () => fail('should failed'),
      error: (error) => (mockError = error),
    });
    const req = httpMock.expectOne(
      `${GEO_API_URL}?q=${inputValue}&limit=${GEO_RESPONSE_LIMIT}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(
      { message: 'Server Unreachable' },
      { status: 500, statusText: 'Server Unreachable' }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'There is an error in the request data.',
      mockError
    );
  });

  it('should get addresses for input from external API', () => {
    const inputValue = 'Berlin';
    const mockResponse = {
      features: [
        {
          properties: {
            osm_id: 123,
            street: 'Hauptstrasse',
            housenumber: '1A',
            postcode: '12345',
            city: 'Berlin',
            district: 'Mitte',
            state: 'Berlin',
            country: 'Germany',
            countrycode: 'de',
          },
        },
      ],
    };

    service.getAddressesForInput(inputValue).subscribe((addresses) => {
      expect(addresses.length).toBe(1);
      expect(addresses[0].city).toBe('Berlin');
    });

    const req = httpMock.expectOne(
      `${GEO_API_URL}?q=${inputValue}&limit=${GEO_RESPONSE_LIMIT}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get addresses from backend', () => {
    const mockAddresses: IAddressDto[] = [
      {
        addressId: 1,
        street: 'Marktstraße',
        houseNumber: '10',
        postcode: '10115',
        city: 'Berlin',
        district: 'Mitte',
        state: 'Berlin',
        country: 'Germany',
        countryCode: 'de',
      },
    ];

    service.getAddresses();

    const req = httpMock.expectOne(BACKEND_API_ADDRESS_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockAddresses);

    service.addresses$.subscribe((addresses) => {
      expect(addresses.length).toBe(1);
      expect(addresses[0].city).toBe('Berlin');
    });
  });

  // it('should handel error when backend server is offline', () => {
  //   // const inputValue = 'Berlin';
  //   const consoleSpy = spyOn(console, 'error');
  //   let mockError: any;
  //   service.getAddresses();
  //   const req = httpMock.expectOne(BACKEND_API_ADDRESS_URL);
  //   // expect(req.request.method).toBe('GET');
  //   service.addresses$.subscribe({
  //     next: () => fail('should failed'),
  //     error: (error) => (mockError = error),
  //   });
  //   req.flush(
  //     { message: 'Server Unreachable' },
  //     { status: 500, statusText: 'Server Unreachable' }
  //   );

  //   expect(consoleSpy).toHaveBeenCalledWith('Get addresses from backend wrong');
  // });

  it('should save a new address', () => {
    const newAddress: IAddressDto = {
      addressId: undefined,
      street: 'Neue Straße',
      houseNumber: '7',
      postcode: '99999',
      city: 'Hamburg',
      district: 'Altona',
      state: 'Hamburg',
      country: 'Germany',
      countryCode: 'de',
    };

    const savedAddress = { ...newAddress, addressId: 100 };

    service.saveAddress(newAddress).subscribe((res) => {
      expect(res.addressId).toBe(100);
      expect(res.city).toBe('Hamburg');
    });

    const req = httpMock.expectOne(BACKEND_API_ADDRESS_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.addressId).toBeUndefined();
    req.flush(savedAddress);
  });
});
