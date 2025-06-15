import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { map, Observable } from 'rxjs';
import { IContactDto } from '../../models/dtos/contact.dto';

@Component({
  selector: 'app-search-contacts',
  imports: [AutoCompleteModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './search-contacts.component.html',
  styleUrl: './search-contacts.component.scss',
})
export class SearchContactsComponent implements OnInit {
  @Output() selectedContact = new EventEmitter<IContactDto>();

  items$: Observable<IContactDto[]> = new Observable<IContactDto[]>();

  value: IContactDto | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContacts();
    this.contactService.contacts$.subscribe();
  }

  search(event: AutoCompleteCompleteEvent) {
    const input = event.query.toLowerCase();
    this.items$ = this.contactService.contacts$.pipe(
      map((contacts) =>
        contacts.filter(
          (contact) =>
            contact.firstname.toLowerCase().includes(input) ||
            contact.lastname.toLowerCase().includes(input) ||
            contact.email.toLowerCase().includes(input) ||
            contact.phone?.includes(input)
        )
      )
    );
  }

  selectContact(event: AutoCompleteSelectEvent) {
    console.log(event.value);
    const contact: IContactDto = event.value as IContactDto;
    this.selectedContact.emit(contact);
  }
}
