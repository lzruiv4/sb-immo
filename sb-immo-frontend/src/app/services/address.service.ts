import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { IAddressDto } from '../models/dtos/address.dto';
import { HttpClient } from '@angular/common/http';
import { GEO_API_URL, GEO_RESPONSE_LIMIT } from '../core/apis/geo.api';
import { BACKEND_API_ADDRESS_URL } from '../core/apis/backend.api';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  // address suggests from ext api
  private addressesForInputSubject = new BehaviorSubject<IAddressDto[]>([]);
  addressesForInput$ = this.addressesForInputSubject.asObservable();

  // addresses from backend
  private addressesSubject = new BehaviorSubject<IAddressDto[]>([]);
  addresses$ = this.addressesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private addressHttp: HttpClient) {}

  getAddressesForInput(value: string): Observable<IAddressDto[]> {
    this.loadingSubject.next(true);
    return this.addressHttp
      .get<any>(`${GEO_API_URL}?q=${value}&limit=${GEO_RESPONSE_LIMIT}`)
      .pipe(
        map((response) =>
          response.features.map((item: any) => {
            return {
              addressId: item.properties.osm_id,
              street: item.properties.street,
              houseNumber: item.properties.housenumber,
              postcode: item.properties.postcode,
              city: item.properties.city,
              district: item.properties.district,
              state: item.properties.state,
              country: item.properties.country,
              countryCode: item.properties.countrycode,
            } as IAddressDto;
          })
        ),
        catchError((error) => {
          console.error('There is an error in the request data.', error);
          return throwError(() => error);
        }),
        tap((addresses) => {
          this.addressesForInputSubject.next(addresses || []);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
  }

  getAddresses(): void {
    this.loadingSubject.next(true);
    this.addressHttp
      .get<IAddressDto[]>(BACKEND_API_ADDRESS_URL)
      .pipe(
        tap((addresses) => this.addressesSubject.next(addresses)),
        catchError((error) => {
          console.error('Get addresses from backend wrong', error);
          this.addressesSubject.next([]);
          return throwError(() => error);
        }),
        finalize(() => {
          console.log(this.addresses$);
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }

  // Maybe only save address, so do not make update
  saveAddress(newAddress: IAddressDto): Observable<IAddressDto> {
    this.loadingSubject.next(true);
    return this.addressHttp
      .post<IAddressDto>(BACKEND_API_ADDRESS_URL, newAddress)
      .pipe(
        tap((address) => {
          const addresses = this.addressesSubject.getValue() ?? [];
          this.addressesSubject.next([...addresses, address]);
        }),
        catchError((error) => {
          console.error('Error occurred during save a new address.');
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}
