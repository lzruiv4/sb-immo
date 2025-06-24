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

  /**
   * Retrieves relevant contact information for a given contact ID.
   *
   * This method first fetches the relevant contact IDs by provided `contactId`,
   * then retrieves the corresponding contact details. e.g. `propertyId`
   *
   * @param contactId - The unique identifier of the contact to search for.
   * @returns An Observable that emits the relevant contact information (`ISearchRelevantContact`).
   */
  getRelevantContactByContactId(
    contactId: string
  ): Observable<ISearchRelevantContact> {
    return this.getRelevantContactIdsByContactId(contactId).pipe(
      switchMap((ids) => this.findRelevantContacts(ids)),
      catchError((err) => {
        console.error(`Failed to get contacts for ${contactId}:`, err);
        return throwError(
          () => new Error(`Can not find anything about ${contactId}`)
        );
      })
    );
  }

  /**
   * Retrieves relevant contact IDs with the same property records as the given contact ID,
   * grouped by their roles (owner, renter, service provider).
   *
   * This method fetches all property records, finds those linked to the specified contact ID,
   * and then identifies other contacts associated with the same properties, categorizing them
   * by their roles.
   *
   * @param contactId - The ID of the contact for whom to find relevant contacts.
   * @returns An Observable emitting an object containing the original contact ID and arrays of contact IDs
   *          for owners, renters, and service providers associated with the same properties.
   */
  getRelevantContactIdsByContactId(
    contactId: string
  ): Observable<ISearchRelevantContactID> {
    this.propertyRecordService.getPropertyRecords();
    return this.propertyRecordService.propertyRecords$.pipe(
      filter((records) => records.length > 0),
      take(1),
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
                  propertyRecord.role === RoleType.ROLE_SERVICE
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
          // return empty
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
