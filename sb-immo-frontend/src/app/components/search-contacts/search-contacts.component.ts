import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { IContactDto } from '../../models/dtos/contact.dto';

@Component({
  selector: 'app-search-contacts',
  imports: [AutoCompleteModule, CommonModule, FormsModule],
  templateUrl: './search-contacts.component.html',
  styleUrl: './search-contacts.component.scss',
})
export class SearchContactsComponent implements OnInit, OnChanges {
  @Input() current: IContactDto | null = null;
  @Input() name: string = '';
  @Output() selectedContact = new EventEmitter<IContactDto>();

  // items$: Observable<IContactDto[]> = new Observable<IContactDto[]>();

  value: IContactDto | null = null;

  constructor(private contactService: ContactService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['current']) {
      this.value = this.current;
    }
  }

  data: any[] = [];

  ngOnInit(): void {
    if (this.current) this.value = this.current;
    // this.contactService.contacts$.subscribe();
  }

  search(event: AutoCompleteCompleteEvent) {
    const input = event.query.toLowerCase();
    // this.contactService.contacts$.subscribe((contacts) => {
    //   this.data = contacts.filter(
    //     (contact) =>
    //       contact.firstname.toLowerCase().includes(input) ||
    //       contact.lastname.toLowerCase().includes(input) ||
    //       contact.email.toLowerCase().includes(input)
    //   );
    // });
    this.contactService.contacts$.subscribe((contacts) => {
      this.data = contacts;
    });
  }

  selectContact(event: AutoCompleteSelectEvent) {
    console.log(event.value);
    const contact: IContactDto = event.value as IContactDto;
    this.selectedContact.emit(contact);
  }
}
