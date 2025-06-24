import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { IContactDto } from '../../models/dtos/contact.dto';
import { CreateContactComponent } from '../create-contact/create-contact.component';
import { Observable } from 'rxjs';
import { ISearchRelevantContact } from '../../share/models/search-relevant-contacts';
import { FindContactsComponent } from '../find-contacts/find-contacts.component';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-contact',
  imports: [
    AvatarModule,
    FormsModule,
    TableModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    CommonModule,
    ButtonModule,
    CreateContactComponent,
    FindContactsComponent,
    ConfirmDialog,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  providers: [ConfirmationService],
})
export class ContactComponent {
  loading: boolean = false;
  openCreateDialog: boolean = false;
  isContactsDialog: boolean = false;

  currentContactId: string | null = null;

  constructor(
    private contactService: ContactService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService // service from primeng, show message for delete
  ) {}

  get contact$() {
    return this.contactService.contacts$;
  }

  relevantContacts$: Observable<ISearchRelevantContact[]> = new Observable<
    ISearchRelevantContact[]
  >();

  onRowEditInit() {}

  openContactsDialog(contactId: string) {
    this.currentContactId = contactId;
    this.isContactsDialog = true;
  }

  closeContactsDialog() {
    this.currentContactId = null;
    this.isContactsDialog = false;
  }

  onRowEditSave(contactToBeEdit: IContactDto) {
    if (this.contactService.isContactDuplicated(contactToBeEdit)) {
      this.notificationService.warn('warn', 'Update: Contact is duplicated');
    } else {
      this.contactService.updateContact(contactToBeEdit).subscribe({
        next: () => {
          this.notificationService.success(
            'success',
            'Update: Contact successful'
          );
        },
        error: (error) => {
          this.notificationService.error(
            'error',
            'Update: Contact failed',
            error
          );
        },
      });
    }
    this.contactService.getContacts();
  }

  onRowEditCancel() {
    this.contactService.getContacts();
  }

  onRowDelete(contact: IContactDto) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${contact.firstname} ${contact.lastname}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contactService.deleteContact(contact.contactId!).subscribe({
          next: () => {
            this.notificationService.success(
              'success',
              'Delete: Contact successful deleted'
            );
          },
          error: (error) => {
            this.notificationService.error(
              'error',
              'Delete: Contact failed',
              error
            );
          },
        });
      },
    });
    this.contactService.getContacts();
  }
}
