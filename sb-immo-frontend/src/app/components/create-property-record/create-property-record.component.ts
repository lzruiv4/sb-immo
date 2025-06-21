import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IPropertyRecordDto } from '../../models/dtos/property-record.dto';
import { RoleType, RoleTypeDescriptions } from '../../models/enums/role.enum';
import { PropertyRecordService } from '../../services/property-record.service';
import { SearchPropertyComponent } from '../search-property/search-property.component';
import { IContactDto } from '../../models/dtos/contact.dto';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { SearchContactsComponent } from '../search-contacts/search-contacts.component';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TagModule } from 'primeng/tag';
import { BasisCombosComponent } from '../../share/basis-components/basis-combos/basis-combos.component';
import { NotificationService } from '../../services/notification.service';

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
    BasisCombosComponent,
  ],
  templateUrl: './create-property-record.component.html',
  styleUrl: './create-property-record.component.scss',
})
export class CreatePropertyRecordComponent {
  @Input() visible = false;
  @Output() closeDialog = new EventEmitter<void>();

  roles = RoleTypeDescriptions;
  serviceProvider: RoleType = RoleType.ROLE_SERVICE;

  propertyRecord: IPropertyRecordDto = {
    propertyId: '',
    contactId: '',
    role: RoleType.ROLE_OWNER,
    startAt: new Date(),
    endAt: undefined,
    notes: '',
  };

  constructor(
    private propertyRecordService: PropertyRecordService,
    private notificationService: NotificationService
  ) {}

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
    if (this.propertyRecordService.checkPropertyRecord(this.propertyRecord)) {
      this.propertyRecordService
        .saveNewPropertyRecord(this.propertyRecord)
        .subscribe({
          next: (response) => {
            this.notificationService.success(
              'success',
              'Create property record successful'
            );
          },
          error: (error) => {
            this.notificationService.error(
              error,
              'Create property record failed'
            );
          },
        });
    }
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

  roleSelected(role: any): void {
    this.propertyRecord.role = role.value;
  }
}
