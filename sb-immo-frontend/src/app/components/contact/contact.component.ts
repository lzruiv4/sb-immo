import { Component, OnInit } from '@angular/core';
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
    CreateContactComponent
],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  loading: boolean = false;

  openCreateDialog = false;

  openDialog() {
    this.openCreateDialog = true;
  }

  constructor(private contactService: ContactService) {}

  get contact$() {
    return this.contactService.contacts$;
  }

  ngOnInit(): void {
    this.contactService.getContacts();
    this.contactService.contacts$.subscribe();
  }

  onRowEditInit() {}

  showContactDetails(contactId: string) {
    throw new Error('Method not implemented.');
  }

  onRowEditSave(contactToBeEdit: IContactDto) {
    this.contactService.updateContact(contactToBeEdit).subscribe();
  }

  onRowEditCancel() {
    this.contactService.getContacts();
  }
}
