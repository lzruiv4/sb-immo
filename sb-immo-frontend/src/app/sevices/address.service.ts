import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { IAddressDto } from '../models/dtos/address.dto';
import { HttpClient } from '@angular/common/http';
import { GEO_API_URL, GEO_RESPONSE_LIMIT } from '../core/apis/geo.api';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private addressesSubject = new BehaviorSubject<IAddressDto[]>([]);
  addresses$ = this.addressesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private addressHttp: HttpClient) {}

  getAddresses(value: string): Observable<IAddressDto[]> {
    this.loadingSubject.next(true);
    console.log('AddressService getAddresses called with value:', value);
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
          return of([]);
        }),
        tap((addresses) => {
          this.addressesSubject.next(addresses || []);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
  }
}
