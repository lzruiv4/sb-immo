import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { IPropertyRecordDto } from '../models/dtos/property-record.dto';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API_PROPERTY_RECORD_URL } from '../core/apis/backend.api';
import { RoleType } from '../models/enums/role.enum';

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
        map((propertyRecords) =>
          propertyRecords.map((propertyRecord) => ({
            ...propertyRecord,
            createdAt: new Date(propertyRecord.createdAt!),
            startAt: new Date(propertyRecord.startAt!),
            endAt: propertyRecord.endAt
              ? new Date(propertyRecord.endAt)
              : undefined,
          }))
        ),
        tap((propertyRecords) =>
          this.propertyRecordsSubject.next(propertyRecords)
        ),
        catchError((error) => {
          console.error('There is an error in the request data.', error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }

  getOverlappingPropertyRecordsByContactId(
    contactId: string
  ): Observable<IPropertyRecordDto[]> {
    return this.propertyRecords$.pipe(
      map((propertyRecords) => {
        const propertyRecordsByContactId = propertyRecords
          .filter(
            (propertyRecord) =>
              propertyRecord.contactId === contactId &&
              propertyRecord.role === RoleType.ROLE_RENTER
          )
          .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

        const overlappingPropertyRecords: Set<IPropertyRecordDto> = new Set();

        // TODO
        for (let i = 1; i < propertyRecordsByContactId.length; i++) {
          const prev = propertyRecordsByContactId[i - 1];
          const curr = propertyRecordsByContactId[i];
          const prevEnd = prev.endAt ?? new Date(8640000000000000);

          if (curr.startAt < prevEnd) {
            overlappingPropertyRecords.add(prev);
            overlappingPropertyRecords.add(curr);
          }
        }
        // console.log('@@@@', Array.from(overlappingPropertyRecords));
        return Array.from(overlappingPropertyRecords);
      })
    );
  }

  saveNewPropertyRecord(
    newPropertyRecordDto: IPropertyRecordDto
  ): Observable<IPropertyRecordDto> {
    this.loadingSubject.next(true);
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
