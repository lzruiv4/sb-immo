import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AddressService } from './address.service';
import { IAddressDto } from '../models/dtos/address.dto';
import { GEO_API_URL, GEO_RESPONSE_LIMIT } from '../core/apis/geo.api';
import { BACKEND_API_ADDRESS_URL } from '../core/apis/backend.api';

describe('AddressService', () => {
  let service: AddressService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // 1. 配置测试模块，导入 HttpClientTestingModule
    TestBed.configureTestingModule({
      providers: [AddressService, provideHttpClientTesting()],
    });

    // 2. 注入服务和 HttpTestingController
    service = TestBed.inject(AddressService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // 3. 确认所有请求都已被处理，防止遗漏
    httpTestingController.verify();
  });

  // 测试 getAddressesForInput
  it('should fetch addresses for input and update subjects correctly', (done) => {
    const mockResponse = {
      features: [
        {
          properties: {
            osm_id: '123',
            street: 'Main St',
            housenumber: '10',
            postcode: '12345',
            city: 'Test City',
            district: 'Test District',
            state: 'Test State',
            country: 'Test Country',
            countrycode: 'TC',
          },
        },
      ],
    };

    // 订阅 addressesForInput$，验证 BehaviorSubject 是否被更新
    service.addressesForInput$.subscribe((addresses) => {
      if (addresses.length > 0) {
        expect(addresses[0].addressId).toBe(123);
        expect(addresses[0].street).toBe('Main St');
        done();
      }
    });

    // 调用服务方法，触发 Http 请求
    service.getAddressesForInput('test').subscribe((addresses) => {
      expect(addresses.length).toBe(1);
      expect(addresses[0].city).toBe('Test City');
    });

    // 断言请求 URL 和请求方法
    const req = httpTestingController.expectOne(
      `${GEO_API_URL}?q=test&limit=${GEO_RESPONSE_LIMIT}`
    );
    expect(req.request.method).toEqual('GET');

    // 模拟返回数据
    req.flush(mockResponse);
  });

  // 测试 getAddresses
  it('should get addresses from backend and update subject', () => {
    const mockAddresses: IAddressDto[] = [
      {
        addressId: 1,
        street: 'Street 1',
        houseNumber: '1',
        postcode: '11111',
        city: 'City1',
        district: '',
        state: '',
        country: '',
        countryCode: '',
      },
    ];

    // 调用服务方法
    service.getAddresses();

    // 断言请求
    const req = httpTestingController.expectOne(BACKEND_API_ADDRESS_URL);
    expect(req.request.method).toBe('GET');

    // 返回模拟数据
    req.flush(mockAddresses);

    // 验证 BehaviorSubject 更新
    service.addresses$.subscribe((addresses) => {
      expect(addresses).toEqual(mockAddresses);
    });
  });

  // 测试 saveAddress
  it('should save new address and append to addressesSubject', () => {
    const newAddress: IAddressDto = {
      addressId: undefined,
      street: 'New Street',
      houseNumber: '5',
      postcode: '55555',
      city: 'New City',
      district: '',
      state: '',
      country: '',
      countryCode: '',
    };

    const savedAddress: IAddressDto = { ...newAddress, addressId: 2 };

    // 先初始化 BehaviorSubject
    service['addressesSubject'].next([]);

    // 调用保存方法
    service.saveAddress(newAddress).subscribe((address) => {
      expect(address.addressId).toBe(2);
    });

    // 断言请求
    const req = httpTestingController.expectOne(BACKEND_API_ADDRESS_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.addressId).toBeUndefined();

    // 模拟服务器返回已保存的地址
    req.flush(savedAddress);

    // 验证 BehaviorSubject 是否添加了新地址
    service.addresses$.subscribe((addresses) => {
      expect(addresses.length).toBe(1);
      expect(addresses[0].addressId).toBe(2);
    });
  });

  // 测试 getAddressesForInput 错误处理
  it('should handle error in getAddressesForInput', (done) => {
    service.getAddressesForInput('test').subscribe({
      next: () => {
        // 不应该走这里
      },
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      },
    });

    const req = httpTestingController.expectOne(
      `${GEO_API_URL}?q=test&limit=${GEO_RESPONSE_LIMIT}`
    );
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
