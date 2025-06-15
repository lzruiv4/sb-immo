import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-search-contacts',
  imports: [AutoCompleteModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './search-contacts.component.html',
  styleUrl: './search-contacts.component.scss',
})
export class SearchContactsComponent implements OnInit {
  items$!: Observable<string[]>;

  value: any;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContacts();
    this.contactService.contacts$.subscribe();
  }

  search(event: AutoCompleteCompleteEvent) {
    const input = event.query.toLowerCase();
    this.items$ = this.contactService.contacts$.pipe(
      map((contacts) =>
        contacts
          .map((contact) => contact.firstname)
          .filter((firstname) => firstname.toLowerCase().includes(input))
      )
    );
  }
}
