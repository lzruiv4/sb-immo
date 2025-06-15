import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { IPropertyRecordDto } from '../models/dtos/property-record.dto';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API_PROPERTY_RECORD_URL } from '../core/apis/backend.api';

@Injectable({
  providedIn: 'root',
})
export class PropertyRecordService {
  private propertyRecordsSubject = new BehaviorSubject<IPropertyRecordDto[]>(
    []
  );
  propertyRecords$ = this.propertyRecordsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private propertyRecordHttp: HttpClient) {}

  getPropertyRecords(): void {
    this.loadingSubject.next(true);
    this.propertyRecordHttp
      .get<IPropertyRecordDto[]>(BACKEND_API_PROPERTY_RECORD_URL)
      .pipe(
        tap((propertyRecords) =>
          this.propertyRecordsSubject.next(propertyRecords)
        ),
        catchError((error) => {
          console.error('There is an error in the request data.', error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
          console.log('sss', this.propertyRecords$);
        })
      )
      .subscribe();
  }

  saveNewPropertyRecord(
    newPropertyRecordDto: IPropertyRecordDto
  ): Observable<IPropertyRecordDto> {
    this.loadingSubject.next(true);
    console.log('22222,  ', newPropertyRecordDto);
    return this.propertyRecordHttp
      .post<IPropertyRecordDto>(
        BACKEND_API_PROPERTY_RECORD_URL,
        newPropertyRecordDto
      )
      .pipe(
        tap((propertyRecord) => {
          const currentList = this.propertyRecordsSubject.getValue() ?? [];
          this.propertyRecordsSubject.next([propertyRecord, ...currentList]);
        }),
        catchError((error) => {
          console.error('Error occurred during create new property record.');
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updatePropertyRecord(
    propertyRecordId: string,
    updatePropertyRecord: IPropertyRecordDto
  ): Observable<IPropertyRecordDto> {
    this.loadingSubject.next(true);
    return this.propertyRecordHttp
      .put<IPropertyRecordDto>(
        `${BACKEND_API_PROPERTY_RECORD_URL}/${propertyRecordId}`,
        updatePropertyRecord
      )
      .pipe(
        tap((propertyRecord) => {
          const currentList = this.propertyRecordsSubject.value;
          const updateList = currentList.map((item) =>
            // update info in list
            item.propertyRecordId === propertyRecordId
              ? { ...item, ...propertyRecord }
              : item
          );
          this.propertyRecordsSubject.next(updateList);
        }),
        catchError((error) => {
          console.error('Error occurred during update a property record.');
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  /**
   * property record will not be deleted
   */
}
