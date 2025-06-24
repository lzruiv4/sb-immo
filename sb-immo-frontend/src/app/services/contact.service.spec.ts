import { fakeAsync, TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';
import { IContactDto } from '../models/dtos/contact.dto';
import { BACKEND_API_CONTACT_URL } from '../core/apis/backend.api';

describe('ContactService', () => {
  let contactService: ContactService;
  let httpMock: HttpTestingController;
  const mockContacts: IContactDto[] = [
    {
      contactId: '1',
      firstname: 'A',
      lastname: 'test',
      email: 'Atest@test.test',
      phone: '123',
    },
    {
      contactId: '2',
      firstname: 'B',
      lastname: 'test',
      email: 'Btest@test.test',
      phone: '1234',
    },
    {
      contactId: '3',
      firstname: 'C',
      lastname: 'test',
      email: 'test1@test.test',
      phone: '12345',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService, NotificationService, MessageService],
    });
    contactService = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // 确保没有未处理的 HTTP 请求
  });

  it('should return true, when the email or phone duplicated', () => {
    const initReq = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockContacts);

    contactService['contactsSubject'].next(mockContacts);

    const duplicatedPhone = {
      contactId: '3',
      firstname: 'C',
      lastname: 'test',
      email: 'test1@test.test',
      phone: '1234',
    };
    const isDuplicatedPhone =
      contactService.isContactDuplicated(duplicatedPhone);
    expect(isDuplicatedPhone).toBe(true);

    const duplicatedEmail = {
      contactId: '3',
      firstname: 'C',
      lastname: 'test',
      email: 'Atest@test.test',
      phone: '12345',
    };
    const isDuplicatedEmail =
      contactService.isContactDuplicated(duplicatedEmail);
    expect(isDuplicatedEmail).toBe(true);
  });

  it('should be three elements in contacts', fakeAsync(() => {
    const req = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
    contactService.contacts$.subscribe((contacts) => {
      expect(contacts.length).toBe(3);
    });
  }));

  it('should save new contact', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockContacts);
    const newContact: IContactDto = {
      contactId: '4',
      firstname: 'D',
      lastname: 'test',
      email: 'Dtest@test.test',
      phone: '123456',
    };

    contactService.saveNewContact(newContact).subscribe((response) => {
      expect(response).toBe(newContact);
    });

    const req = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(newContact);
    req.flush(newContact);

    contactService.contacts$.subscribe((contacts) => {
      expect(contacts.length).toBe(4);
      const contact = contacts
        .filter((contact) => contact.contactId === '4')
        .at(0);
      expect(contact?.firstname).toBe('D');
      expect(contact?.lastname).toBe('test');
    });
  }));

  it('should handle error when save a contact failed', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockContacts);

    const newContact: IContactDto = {
      firstname: 'CC',
      lastname: 'test',
      email: 'CCtest@test.test',
      phone: '12345',
    };

    const consoleSpy = spyOn(console, 'error'); // 监听 console.error 调用  'Error occurred during update a contact.'
    let mockError: any;
    contactService.saveNewContact(newContact).subscribe({
      next: () => fail('should failed'),
      error: (err) => (mockError = err),
    });
    const req = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(req.request.method).toBe('POST');
    req.flush(
      { message: 'Server Unreachable' },
      { status: 500, statusText: 'Server Unreachable' }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error occurred during create new contact.'
    );
  }));

  it('should update a contact', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockContacts);

    const updatedContact: IContactDto = {
      contactId: '3',
      firstname: 'CC',
      lastname: 'test',
      email: 'CCtest@test.test',
      phone: '12345',
    };

    contactService.updateContact(updatedContact).subscribe((contact) => {
      expect(contact.firstname).toBe('CC');
      expect(contact.email).toBe('CCtest@test.test');
    });
    const req = httpMock.expectOne(BACKEND_API_CONTACT_URL + '/3');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedContact);

    contactService.contacts$.subscribe((contacts) => {
      expect(contacts.length).toBe(3);
    });
  }));

  it('should handle error when update a contact failed', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockContacts);

    const updatedContact: IContactDto = {
      contactId: '4',
      firstname: 'CC',
      lastname: 'test',
      email: 'CCtest@test.test',
      phone: '12345',
    };

    let mockError: any;

    spyOn(console, 'error'); // 监听 console.error 调用  'Error occurred during update a contact.'

    contactService.updateContact(updatedContact).subscribe({
      next: () => fail('should failed'),
      error: (err) => (mockError = err),
    });
    const req = httpMock.expectOne(BACKEND_API_CONTACT_URL + '/4');
    expect(req.request.method).toBe('PUT');
    req.flush(
      { message: 'Not found' },
      { status: 404, statusText: 'Contact not found' }
    );

    expect(console.error).toHaveBeenCalledWith(
      'Error occurred during update a contact.'
    );
  }));

  it('should delete a contact', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockContacts);
    contactService.deleteContact('3').subscribe();
    const req = httpMock.expectOne(BACKEND_API_CONTACT_URL + '/3');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    contactService.contacts$.subscribe((contacts) => {
      expect(contacts.length).toBe(2);
    });
  }));

  it('should handle error when delete a contact failed', fakeAsync(() => {
    const initReq = httpMock.expectOne(BACKEND_API_CONTACT_URL);
    expect(initReq.request.method).toBe('GET');
    initReq.flush(mockContacts);

    const consoleSpy = spyOn(console, 'error');

    let receivedError: any;
    contactService.deleteContact('4').subscribe({
      next: () => fail('should failed'),
      error: (err) => (receivedError = err),
    });

    const req = httpMock.expectOne(BACKEND_API_CONTACT_URL + '/4');
    expect(req.request.method).toBe('DELETE');
    req.flush(
      { message: 'Not found' },
      { status: 404, statusText: 'Contact not found' }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error occurred during delete a contact.'
    );
  }));
});
