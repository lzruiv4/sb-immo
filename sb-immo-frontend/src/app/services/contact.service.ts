import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, tap } from 'rxjs';
import { IContactDto } from '../models/dtos/contact.dto';
import { BACKEND_API_CONTACT_URL } from '../core/apis/backend.api';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactsSubject = new BehaviorSubject<IContactDto[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private contactHttp: HttpClient) {}

  getContacts(): void {
    this.loadingSubject.next(true);
    this.contactHttp
      .get<IContactDto[]>(BACKEND_API_CONTACT_URL)
      .pipe(
        tap((contacts) => this.contactsSubject.next(contacts)),
        catchError((error) => {
          console.error('There is an error in the request data.', error);
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  saveNewContact(newContactDto: IContactDto): Observable<IContactDto> {
    this.loadingSubject.next(true);
    return this.contactHttp
      .post<IContactDto>(BACKEND_API_CONTACT_URL, newContactDto)
      .pipe(
        tap((contact) => {
          const contacts = this.contactsSubject.getValue() ?? [];
          this.contactsSubject.next([contact, ...contacts]);
        }),
        catchError((error) => {
          console.error('Error occurred during create new contact.');
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updateContact(updateContact: IContactDto): Observable<IContactDto> {
    this.loadingSubject.next(true);
    return this.contactHttp
      .put<IContactDto>(
        `${BACKEND_API_CONTACT_URL}/${updateContact.contactId}`,
        updateContact
      )
      .pipe(
        tap((contact) => {
          const currentList = this.contactsSubject.value;
          const updateList = currentList.map((item) =>
            // update info in list
            item.contactId === updateContact.contactId
              ? { ...item, ...contact }
              : item
          );
          this.contactsSubject.next(updateList);
        }),
        catchError((error) => {
          console.error('Error occurred during update a contact.');
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  deleteContact(contactId: string): Observable<void> {
    this.loadingSubject.next(true);
    return this.contactHttp
      .delete<void>(`${BACKEND_API_CONTACT_URL}/${contactId}`)
      .pipe(
        tap(() => {
          const currentList = this.contactsSubject.value;
          const updateList = currentList.filter(
            (contact) => contact.contactId !== contactId
          );
          this.contactsSubject.next(updateList);
        }),
        catchError((error) => {
          console.error('Error occurred during delete a contact.');
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}
