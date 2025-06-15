import { Component, OnInit } from '@angular/core';
import { SearchContactsComponent } from '../search-contacts/search-contacts.component';
import { PropertyRecordService } from '../../services/connection.service';
import {
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { IContactDto } from '../../models/dtos/contact.dto';

@Component({
  selector: 'app-property-record',
  imports: [SearchContactsComponent, AutoCompleteModule],
  templateUrl: './property-record.component.html',
  styleUrl: './property-record.component.scss',
})
export class PropertyRecordComponent implements OnInit {
  constructor(private propertyRecordService: PropertyRecordService) {}

  ngOnInit(): void {
    this.propertyRecordService.getPropertyRecords();
    this.propertyRecordService.propertyRecords$.subscribe();
  }

  get propertyRecords$() {
    return this.propertyRecordService.propertyRecords$;
  }

  handleContactSelected(event: IContactDto): void {
    console.log('ssss', event);
  }
}
