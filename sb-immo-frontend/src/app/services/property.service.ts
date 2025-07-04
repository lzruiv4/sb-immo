import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { IPropertyDto } from '../models/dtos/property.dto';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API_PROPERTY_URL } from '../core/apis/backend.api';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private propertiesSubject = new BehaviorSubject<IPropertyDto[]>([]);
  properties$ = this.propertiesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private propertyHttp: HttpClient) {
    this.getProperties();
  }

  getProperties(): void {
    this.loadingSubject.next(true);
    this.propertyHttp
      .get<IPropertyDto[]>(BACKEND_API_PROPERTY_URL)
      .pipe(
        tap((properties) => this.propertiesSubject.next(properties)),
        catchError((error) => {
          console.error('Error occurred during fetch properties.', error);
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  isPropertyDuplicated(dto: IPropertyDto): boolean {
    const items = this.propertiesSubject.getValue();
    return items.some((property) => {
      if (property.propertyId == dto.propertyId) {
        return false;
      }
      const sameStreet = dto.address.street === property.address.street;
      const sameHouseNumber =
        dto.address.houseNumber === property.address.houseNumber;
      const samePostcode = dto.address.postcode === property.address.postcode;

      const dtoUnit = dto.unit;
      const propertyUnit = property.unit;

      const sameUnit = dtoUnit === propertyUnit;

      return sameStreet && sameHouseNumber && samePostcode && sameUnit;
    });
  }

  saveNewProperty(newPropertyDto: IPropertyDto): Observable<IPropertyDto> {
    this.loadingSubject.next(true);
    return this.propertyHttp
      .post<IPropertyDto>(BACKEND_API_PROPERTY_URL, newPropertyDto)
      .pipe(
        tap((property) => {
          const currentList = this.propertiesSubject.getValue();
          this.propertiesSubject.next([property, ...currentList]);
        }),
        catchError((error) => {
          console.error('Error occurred during create new property.');
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updateProperty(updateProperty: IPropertyDto): Observable<IPropertyDto> {
    this.loadingSubject.next(true);
    console.log('Update, ', updateProperty);
    return this.propertyHttp
      .put<IPropertyDto>(
        `${BACKEND_API_PROPERTY_URL}/${updateProperty.propertyId}`,
        updateProperty
      )
      .pipe(
        tap((property) => {
          const currentList = this.propertiesSubject.value;
          const updateList = currentList.map((item) =>
            // update info in list
            item.propertyId === updateProperty.propertyId
              ? { ...item, ...property }
              : item
          );
          this.propertiesSubject.next(updateList);
        }),
        catchError((error) => {
          console.error(
            'UPDATE_PROPERTY: Error occurred during update a property.'
          );
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  deleteProperty(propertyId: string): Observable<void> {
    this.loadingSubject.next(true);
    return this.propertyHttp
      .delete<void>(`${BACKEND_API_PROPERTY_URL}/${propertyId}`)
      .pipe(
        tap(() => {
          const currentList = this.propertiesSubject.value;
          const updateList = currentList.filter(
            (property) => property.propertyId !== propertyId
          );
          this.propertiesSubject.next(updateList);
        }),
        catchError((error) => {
          console.error('Error occurred during delete a property.');
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}
