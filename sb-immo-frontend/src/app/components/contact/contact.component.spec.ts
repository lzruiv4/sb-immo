import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from '../../services/notification.service';
import { ContactService } from '../../services/contact.service';
import { IContactDto } from '../../models/dtos/contact.dto';
import { of, throwError } from 'rxjs';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactService', [
      'isContactDuplicated',
      'updateContact',
      'getContacts',
    ]);

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'warn',
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        { provide: ContactService, useValue: mockContactService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close contact dialog correctly', () => {
    component.openContactsDialog('123');
    expect(component.currentContactId).toBe('123');
    expect(component.isContactsDialog).toBeTrue();

    component.closeContactsDialog();
    expect(component.currentContactId).toBeNull();
    expect(component.isContactsDialog).toBeFalse();
  });

  it('should warn when contact is duplicated', () => {
    const contact: IContactDto = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'test@test.com',
      phone: '123',
    } as IContactDto;

    mockContactService.isContactDuplicated.and.returnValue(true);

    component.onRowEditSave(contact);

    expect(mockNotificationService.warn).toHaveBeenCalledWith(
      'warn',
      'Update: Contact is duplicated'
    );
    expect(mockContactService.getContacts).toHaveBeenCalled();
  });

  it('should update contact and show success message when contact is not duplicated', () => {
    const contact: IContactDto = {
      contactId: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'test@test.com',
      phone: '123',
    } as IContactDto;

    mockContactService.isContactDuplicated.and.returnValue(false);
    mockContactService.updateContact.and.returnValue(of(contact));

    component.onRowEditSave(contact);

    expect(mockContactService.updateContact).toHaveBeenCalledWith(contact);
    expect(mockNotificationService.success).toHaveBeenCalledWith(
      'success',
      'Update: Contact successful'
    );
    expect(mockContactService.getContacts).toHaveBeenCalled();
  });

  // it('should show error message when updateContact throws an error', () => {
  //   const contact: IContactDto = {
  //     contactId: '1',
  //     firstname: 'John',
  //     lastname: 'Doe',
  //     email: 'test@test.com',
  //     phone: '123',
  //   } as IContactDto;

  //   mockContactService.isContactDuplicated.and.returnValue(false);
  //   mockContactService.updateContact.and.returnValue(throwError(() => 'error'));

  //   component.onRowEditSave(contact);

  //   expect(mockNotificationService.error).toHaveBeenCalledWith(
  //     'error',
  //     'Update: Contact failed'
  //   );
  //   expect(mockContactService.getContacts).toHaveBeenCalled();
  // });

  it('should refresh contacts when canceling edit', () => {
    component.onRowEditCancel();
    expect(mockContactService.getContacts).toHaveBeenCalled();
  });
});
