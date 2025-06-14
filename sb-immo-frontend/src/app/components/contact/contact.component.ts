import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { AddressSearchComponent } from "../address-search/address-search.component";

@Component({
  selector: 'app-contact',
  imports: [AddressSearchComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  constructor(private contactService: ContactService) {}

  get contact$() {
    return this.contactService.contacts$;
  }

  ngOnInit(): void {
    this.contactService.getContacts();
    this.contactService.contacts$.subscribe();
  }
}
