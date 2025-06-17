import { Injectable } from '@angular/core';
import { ContactService } from './contact.service';
import { PropertyRecordService } from './property-record.service';
import {
  ISearchRelevantContact,
  ISearchRelevantContactID,
} from '../share/models/search-relevant-contacts';
import {
  catchError,
  filter,
  map,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { RoleType } from '../models/enums/role.enum';
import { IContactDto } from '../models/dtos/contact.dto';

@Injectable({
  providedIn: 'root',
})
export class RelevantContactService {
  constructor(
    private contactService: ContactService,
    private propertyRecordService: PropertyRecordService
  ) {}

  getRelevantContactByContactId(
    contactId: string
  ): Observable<ISearchRelevantContact> {
    return this.getRelevantContactIdsByContactId(contactId).pipe(
      switchMap((ids) => this.findRelevantContacts(ids)),
      catchError((err) => {
        console.error(`Failed to get contacts for ${contactId}:`, err);
        return throwError(
          () => new Error(`无法获取联系人 ${contactId} 的相关信息`)
        );
      })
    );
  }

  getRelevantContactIdsByContactId(
    contactId: string
  ): Observable<ISearchRelevantContactID> {
    this.propertyRecordService.getPropertyRecords();
    return this.propertyRecordService.propertyRecords$.pipe(
      filter((records) => records.length > 0), // 确保有数据
      take(1), // 只取最新一次数据
      map((propertyRecords) => {
        // find all property records
        const propertyRecordsByContactId = propertyRecords
          .filter((propertyRecord) => propertyRecord.contactId === contactId)
          .map((propertyRecord) => propertyRecord.propertyId);

        // find all contact with the same property records
        const contactsWithSamePropertyRecord = propertyRecords.filter(
          (propertyRecord) =>
            propertyRecordsByContactId.includes(propertyRecord.propertyId) &&
            propertyRecord.contactId !== contactId
        );

        // find all contact with role owner id
        const ownerIds = Array.from(
          new Set(
            contactsWithSamePropertyRecord
              .filter(
                (propertyRecord) => propertyRecord.role === RoleType.ROLE_OWNER
              )
              .map((propertyRecord) => propertyRecord.contactId)
          )
        );

        // find all contact with role renter id
        const renterIds = Array.from(
          new Set(
            contactsWithSamePropertyRecord
              .filter(
                (propertyRecord) => propertyRecord.role === RoleType.ROLE_RENTER
              )
              .map((propertyRecord) => propertyRecord.contactId)
          )
        );

        // find all contact with role serviceProvider id
        const serviceProviderIds = Array.from(
          new Set(
            contactsWithSamePropertyRecord
              .filter(
                (propertyRecord) =>
                  propertyRecord.role === RoleType.ROLE_SERVICE_PROVIDER
              )
              .map((propertyRecord) => propertyRecord.contactId)
          )
        );

        return {
          contactId: contactId,
          ownerIds: ownerIds,
          renterIds: renterIds,
          serviceProviderIds: serviceProviderIds,
        };
      })
    );
  }

  findRelevantContacts(
    idSet: ISearchRelevantContactID
  ): Observable<ISearchRelevantContact> {
    return this.contactService.contacts$.pipe(
      filter((contacts) => contacts.length > 0),
      take(1),
      map((contacts) => {
        const contact = contacts.find((c) => c.contactId === idSet.contactId);
        if (!contact) {
          console.warn(
            `联系人 ${idSet.contactId} 不存在。可用ID: ${contacts
              .map((c) => c.contactId)
              .join(', ')}`
          );
          return this.createEmptyResponse(idSet.contactId);
        }

        const owners = contacts.filter((contact): contact is IContactDto => {
          return (
            !!contact?.contactId &&
            new Set(idSet.ownerIds).has(contact.contactId)
          );
        });

        const renters = contacts.filter((contact): contact is IContactDto => {
          return (
            !!contact?.contactId &&
            new Set(idSet.renterIds).has(contact.contactId)
          );
        });

        const serviceProviders = contacts.filter(
          (contact): contact is IContactDto => {
            return (
              !!contact?.contactId &&
              new Set(idSet.serviceProviderIds).has(contact.contactId)
            );
          }
        );
        return {
          contact: contact,
          owners: owners,
          renters: renters,
          serviceProviders: serviceProviders,
        };
      })
    );
  }

  private createEmptyResponse(contactId: string): ISearchRelevantContact {
    return {
      contact: {
        contactId: contactId,
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
      },
      owners: [],
      renters: [],
      serviceProviders: [],
    };
  }
}
