import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  finalize,
  map,
  Observable,
  shareReplay,
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
import { IContactDto } from '../models/dtos/contact.dto';
import { IPropertyDto } from '../models/dtos/property.dto';

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
    // this.getPropertyRecords();

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
      tap(() => this.loadingSubject.next(false)),
      startWith([]), // 初始化为空数组，避免UI空白
      shareReplay(1)
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
      const filterPropertyRecords =
        this.getPropertyRecordByRole(propertyRecord);
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
   * excluding the record with the same propertyRecordId
   *
   * @param propertyRecord - The property record DTO used as a reference for filtering.
   *   Its `role` and `propertyId` are used to match records, and its `propertyRecordId`
   *   (if present) is used to exclude a specific record from the results. Because one can
   *  rent the property again
   * @returns An array of `IPropertyRecordDto` objects that have the same role and propertyId
   */
  private getPropertyRecordByRole(
    propertyRecord: IPropertyRecordDto
  ): IPropertyRecordDto[] {
    var filterPropertyRecords = this.propertyRecordsFromDBSubject.getValue();
    if (propertyRecord.propertyRecordId) {
      filterPropertyRecords = filterPropertyRecords.filter(
        (item) => propertyRecord.propertyRecordId != item.propertyRecordId
      );
    }
    return filterPropertyRecords.filter(
      (item) =>
        item.role == propertyRecord.role &&
        item.propertyId == propertyRecord.propertyId
    );
  }

  /**
   * Calculates the earliest available date for a property, given a specific property record and a list of all property records.
   *
   * The function checks for overlaps between the given property record and other property records,
   * and determines the earliest date from which the property can be made available without conflicts.
   *
   * @param propertyRecord - The property record for which to determine the availability date.
   * @param propertyRecords - The list of all property records to check for overlaps.
   * @returns The earliest available date as a `Date` object, or `null` if no availability is found within the given range.
   */
  getPropertyAvailabilityDate(
    propertyRecord: IPropertyRecordDto,
    propertyRecords: IPropertyRecordDto[]
  ): Date | null {
    const MAX_DATE = new Date(8640000000000000);

    const endAt = propertyRecord.endAt ?? MAX_DATE;

    const sortedPropertyRecords = propertyRecords
      .filter((item) => !item.endAt || item.endAt >= propertyRecord.startAt)
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

    let mark = propertyRecord.startAt;

    for (const item of sortedPropertyRecords) {
      const itemEndAt = item.endAt ?? MAX_DATE;

      // 如果当前 cursor 到 requestedEnd 这段，不与 booking 冲突，就说明可以入住
      const noOverlap = endAt <= item.startAt || mark >= itemEndAt;

      if (mark < item.startAt && endAt <= item.startAt) {
        // 整段都在 booking 前面
        return mark;
      }

      if (!noOverlap) {
        // 有重叠，就往后挪 mark
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

  findContact(contactId: string): Observable<IContactDto | undefined> {
    return this.contactService.contacts$.pipe(
      map((contacts) =>
        contacts.find((contact) => contact.contactId === contactId)
      )
    );
  }

  findProperty(propertyId: string): Observable<IPropertyDto | undefined> {
    return this.propertyService.properties$.pipe(
      map((properties) =>
        properties.find((property) => property.propertyId === propertyId)
      )
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
