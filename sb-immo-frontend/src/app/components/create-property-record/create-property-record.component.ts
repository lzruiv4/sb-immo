import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IPropertyRecordDto } from '../../models/dtos/property-record.dto';
import { RoleType } from '../../models/enums/role.enum';
import { PropertyRecordService } from '../../services/property-record.service';
import { SearchPropertyComponent } from '../search-property/search-propery.component';
import { IContactDto } from '../../models/dtos/contact.dto';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { SearchContactsComponent } from '../search-contacts/search-contacts.component';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-create-property-record',
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SearchPropertyComponent,
    SearchContactsComponent,
    DatePickerModule,
    AutoCompleteModule,
    TagModule,
  ],
  templateUrl: './create-property-record.component.html',
  styleUrl: './create-property-record.component.scss',
})
export class CreatePropertyRecordComponent implements OnInit {
  @Input() visible = false;
  @Output() closeDialog = new EventEmitter<void>();

  roles: string[] = [];
  // filteredRoles: string[] = [];

  propertyRecord: IPropertyRecordDto = {
    propertyId: '',
    contactId: '',
    role: RoleType.ROLE_OWNER,
    startAt: new Date(),
    endAt: undefined,
    notes: '',
  };

  constructor(private propertyRecordService: PropertyRecordService) {}

  ngOnInit(): void {
    this.roles = Object.values(RoleType);
    // this.filteredRoles = [...this.roles];
  }

  onStartDateSelect(date: Date) {
    // Make sure the date is what one select
    this.propertyRecord.startAt = date;
    if (
      this.propertyRecord.endAt &&
      this.propertyRecord.startAt != null &&
      this.propertyRecord.endAt < this.propertyRecord.startAt
    ) {
      this.propertyRecord.endAt = undefined;
    }
  }

  onSubmit(ngForm: NgForm) {
    this.propertyRecordService
      .saveNewPropertyRecord(this.propertyRecord)
      .subscribe();
    this.closeDialog.emit();
    ngForm.resetForm;
  }

  onCancel(ngForm: NgForm) {
    this.closeDialog.emit();
    ngForm.resetForm;
  }

  handleContactSelected(contact: IContactDto): void {
    this.propertyRecord.contactId = contact.contactId ?? '';
  }

  handlePropertySelected(property: IPropertyDto): void {
    this.propertyRecord.propertyId = property.propertyId ?? '';
  }

  filterRoles(event: { query: string }) {
    const query = event.query.toLowerCase();
    this.roles = this.roles.filter((role) =>
      role.toLowerCase().includes(query)
    );
  }
}
