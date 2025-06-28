import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  finalize,
  map,
  Observable,
  startWith,
  tap,
  throwError,
} from 'rxjs';
import { IPropertyRecordDto } from '../models/dtos/property-record.dto';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API_PROPERTY_RECORD_URL } from '../core/apis/backend.api';
import { RoleType } from '../models/enums/role.enum';
import { NotificationService } from './notification.service';
import { PropertyService } from './property.service';
import { ContactService } from './contact.service';
import { IPropertyRecord } from '../models/property-record.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyRecordService {
  private propertyRecordsFromDBSubject = new BehaviorSubject<
    IPropertyRecordDto[]
  >([]);
  propertyRecordsFromDB$ = this.propertyRecordsFromDBSubject.asObservable();

  propertyRecords$: Observable<IPropertyRecord[]>;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private propertyRecordHttp: HttpClient,
    private notificationService: NotificationService,
    private propertyService: PropertyService,
    private contactService: ContactService
  ) {
    this.getPropertyRecordsFromDB();

    this.propertyRecords$ = combineLatest([
      this.propertyRecordsFromDB$,
      this.propertyService.properties$,
      this.contactService.contacts$,
    ]).pipe(
      map(([propertyRecords, properties, contacts]) => {
        const propertyMap = new Map(properties.map((p) => [p.propertyId, p]));
        const contactMap = new Map(contacts.map((c) => [c.contactId, c]));

        return propertyRecords.map((record) => {
          const property = propertyMap.get(record.propertyId);
          const contact = contactMap.get(record.contactId);

          return {
            propertyRecordId: record.propertyRecordId,
            property,
            contact,
            role: record.role,
            startAt: record.startAt,
            endAt: record.endAt,
            notes: record.notes,
            createdAt: record.createdAt,
          } as IPropertyRecord;
        });
      }),
      startWith([])
      // shareReplay(1)
    );
  }

  getPropertyRecordsFromDB(): void {
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
          this.propertyRecordsFromDBSubject.next(propertyRecords)
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

  checkPropertyRecord(propertyRecord: IPropertyRecordDto): boolean {
    if (propertyRecord.role !== RoleType.ROLE_SERVICE) {
      // get the property records with the same role
      const filterPropertyRecords =
        this.getPropertyRecordByRole(propertyRecord);
      // Check earliest start time availability
      const startAt = this.getPropertyAvailabilityDate(
        propertyRecord,
        filterPropertyRecords
      );
      if (!startAt) {
        this.notificationService.warn('warn', 'The property is not available');
        return false;
      }
      if (startAt !== propertyRecord.startAt) {
        this.notificationService.warn(
          'warn',
          `The earliest available date is ${startAt.toLocaleString()}`
        );
        return false;
      }
    }
    return true;
  }

  /**
   * Retrieves an array of property records that match the specified role and property ID,
   * excluding the record with the same propertyRecordId as the provided propertyRecord (if present).
   *
   * @param propertyRecord - The IPropertyRecordDto used to filter by role and property ID.
   *        If propertyRecordId is present, the record with this ID will be excluded from the results.
   * @returns An array of property records matching the specified role
   */
  private getPropertyRecordByRole(
    propertyRecord: IPropertyRecordDto
  ): IPropertyRecordDto[] {
    var filterPropertyRecords = this.propertyRecordsFromDBSubject.getValue();
    // For the update
    if (propertyRecord.propertyRecordId) {
      filterPropertyRecords = filterPropertyRecords.filter(
        (item) => propertyRecord.propertyRecordId != item.propertyRecordId
      );
    }
    return filterPropertyRecords.filter(
      (item) =>
        item.role === propertyRecord.role &&
        item.propertyId === propertyRecord.propertyId
    );
  }

  getPropertyAvailabilityDate(
    checkPropertyRecord: IPropertyRecordDto,
    inputPropertyRecords: IPropertyRecordDto[]
  ): Date | null {
    const MAX_DATE = new Date(8640000000000000);
    const endAt = checkPropertyRecord.endAt ?? MAX_DATE;

    /**
     * Return property records can be check with the input and sort by date.
     * Filter out any irrelevant or invalid records
     * — for example, those that start after the target record's end time, or those with an undefined (infinite) end time.
     * Iterate through the remaining records to determine the earliest possible start time.
     * During this process, we also ensure that the corresponding end time remains valid.
     * If a valid time window is found, return the suggested start time; otherwise, return null.
     * */
    const sortedPropertyRecords = inputPropertyRecords
      .filter(
        (propertyRecord) =>
          !propertyRecord.endAt ||
          propertyRecord.endAt >= checkPropertyRecord.startAt
      )
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
    let mark = checkPropertyRecord.startAt;

    for (const propertyRecord of sortedPropertyRecords) {
      const itemEndAt = propertyRecord.endAt ?? MAX_DATE;

      const isOverlap = endAt <= propertyRecord.startAt || mark >= itemEndAt;
      // endAt is before property start and the mark is also before property start
      if (mark < propertyRecord.startAt && endAt <= propertyRecord.startAt) {
        return mark;
      }
      if (!isOverlap) {
        mark = itemEndAt;
      }
    }
    return mark <= endAt ? mark : null;
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
          const currentList = this.propertyRecordsFromDBSubject.getValue();
          this.propertyRecordsFromDBSubject.next([
            propertyRecord,
            ...currentList,
          ]);
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
          const currentList = this.propertyRecordsFromDBSubject.value;
          const updateList = currentList.map((item) =>
            // update info in list
            item.propertyRecordId === propertyRecordId
              ? { ...item, ...propertyRecord }
              : item
          );

          this.propertyRecordsFromDBSubject.next(updateList);
          this.propertyRecords$.subscribe();
        }),
        catchError((error) => {
          console.error('Error occurred during update a property record.');
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  deletePropertyRecord(propertyRecordId: string): Observable<void> {
    this.loadingSubject.next(true);
    return this.propertyRecordHttp
      .delete<void>(`${BACKEND_API_PROPERTY_RECORD_URL}/${propertyRecordId}`)
      .pipe(
        tap(() => {
          const currentList = this.propertyRecordsFromDBSubject.value;
          const updateList = currentList.filter(
            (propertyRecord) =>
              propertyRecord.propertyRecordId !== propertyRecordId
          );
          this.propertyRecordsFromDBSubject.next(updateList);
        }),
        catchError((error) => {
          console.error('Error occurred during delete a property record.');
          return throwError(() => error);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}
