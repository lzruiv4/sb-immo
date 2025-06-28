import { Injectable } from '@angular/core';
import { PropertyRecordService } from './property-record.service';
import { ISearchRelevantContact } from '../share/models/search-relevant-contacts';
import { filter, map, Observable, take } from 'rxjs';
import { RoleType } from '../models/enums/role.enum';
import { IPropertyRecord } from '../models/property-record.model';

@Injectable({
  providedIn: 'root',
})
export class RelevantContactService {
  constructor(private propertyRecordService: PropertyRecordService) {}

  getRelevantPropertyRecordsByContactId(
    contactId: string
  ): Observable<Map<IPropertyRecord, ISearchRelevantContact>> {
    let result = new Map<IPropertyRecord, ISearchRelevantContact>();
    return this.propertyRecordService.propertyRecords$.pipe(
      filter((records) => records.length > 0),
      take(1),
      map((propertyRecords) => {
        // find all property records
        const findAllPropertyRecordsByContactId = propertyRecords.filter(
          (propertyRecord) => propertyRecord.contact.contactId === contactId
        );

        const MAX_DATE = new Date(8640000000000000);

        for (let pr of findAllPropertyRecordsByContactId) {
          // find all contact with the same property records
          const propertyRecordWithSameProperty = propertyRecords.filter(
            (propertyRecord) =>
              propertyRecord.property.propertyId === pr.property.propertyId &&
              propertyRecord.propertyRecordId !== pr.propertyRecordId &&
              propertyRecord.startAt <= (pr.endAt ?? MAX_DATE) &&
              (propertyRecord.endAt ?? MAX_DATE) >= pr.startAt
          );

          // find all contact with role owner
          const owners = Array.from(
            new Set(
              propertyRecordWithSameProperty.filter(
                (propertyRecord) => propertyRecord.role === RoleType.ROLE_OWNER
              )
            )
          );

          // find all contact with role renter
          const renters = Array.from(
            new Set(
              propertyRecordWithSameProperty.filter(
                (propertyRecord) => propertyRecord.role === RoleType.ROLE_RENTER
              )
            )
          );

          // find all contact with role service
          const serviceProviders = Array.from(
            new Set(
              propertyRecordWithSameProperty.filter(
                (propertyRecord) =>
                  propertyRecord.role === RoleType.ROLE_SERVICE
              )
            )
          );

          result.set(pr, {
            owners: owners,
            renters: renters,
            serviceProviders: serviceProviders,
          });
        }
        return result;
      })
    );
  }
}
