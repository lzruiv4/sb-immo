import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { IContactDto } from '../../models/dtos/contact.dto';
import { BasisDataCombosComponent } from '../../share/basis-components/basis-data-combos/basis-data-combos.component';

@Component({
  selector: 'app-search-contacts',
  imports: [BasisDataCombosComponent],
  templateUrl: './search-contacts.component.html',
  styleUrl: './search-contacts.component.scss',
})
export class SearchContactsComponent implements OnChanges {
  @Input() current!: IContactDto;
  @Input() name: string = '';
  @Output() selectedContact = new EventEmitter<IContactDto>();

  value: IContactDto | null = null;

  data: IContactDto[] = [];

  filterContacts = (contact: IContactDto, query: string) =>
    contact.firstname.toLowerCase().includes(query) ||
    contact.lastname.toLowerCase().includes(query) ||
    contact.email.toLowerCase().includes(query);

  constructor(private contactService: ContactService) {
    this.contactService.contacts$.subscribe(
      (contacts) => (this.data = contacts)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['current']) {
      this.value = this.current;
    }
  }

  selectContact(contact: IContactDto) {
    this.selectedContact.emit(contact);
  }
}
