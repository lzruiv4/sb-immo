import { Component } from '@angular/core';
import { PropertyRecordService } from '../../services/property-record.service';
import { CreatePropertyRecordComponent } from '../create-property-record/create-property-record.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { SearchPropertyComponent } from '../search-property/search-property.component';
import { SearchContactsComponent } from '../search-contacts/search-contacts.component';
import { RoleType, RoleTypeDescriptions } from '../../models/enums/role.enum';
import { BasisCombosComponent } from '../../share/basis-components/basis-combos/basis-combos.component';
import { ITag } from '../../share/models/tag.model';
import { DatePickerModule } from 'primeng/datepicker';
import { dateFormat } from '../../share/models/date.model';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { IContactDto } from '../../models/dtos/contact.dto';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import {
  IPropertyRecord,
  modelToDto,
} from '../../models/property-record.model';

@Component({
  selector: 'app-property-record',
  imports: [
    CreatePropertyRecordComponent,
    AvatarModule,
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    CommonModule,
    ButtonModule,
    SearchPropertyComponent,
    SearchContactsComponent,
    BasisCombosComponent,
    DatePickerModule,
    ConfirmDialog,
  ],
  standalone: true,
  templateUrl: './property-record.component.html',
  styleUrl: './property-record.component.scss',
  providers: [ConfirmationService],
})
export class PropertyRecordComponent {
  loading: boolean = false;
  openCreateDialog: boolean = false;

  statuses = RoleTypeDescriptions;
  defaultDateForm: string = dateFormat;

  constructor(
    private propertyRecordService: PropertyRecordService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService // service from primeng, show message for delete
  ) {}

  get propertyRecords$() {
    return this.propertyRecordService.propertyRecords$;
  }

  openDialog(): void {
    this.openCreateDialog = true;
  }

  onRowEditInit(): void {}

  onRowEditSave(propertyRecord: IPropertyRecord): void {
    if (
      this.propertyRecordService.checkPropertyRecord(modelToDto(propertyRecord))
    ) {
      this.propertyRecordService
        .updatePropertyRecord(
          propertyRecord.propertyRecordId!,
          modelToDto(propertyRecord)
        )
        .subscribe({
          next: () => {
            this.notificationService.success(
              'success',
              'Update property record successful'
            );
          },
          error: () => {
            this.notificationService.error(
              'error',
              'Update property record failed'
            );
          },
        });
    }
    this.onRowEditCancel();
  }

  onRowEditCancel(): void {
    this.propertyRecordService.getPropertyRecordsFromDB();
  }

  getStatusTag(status: RoleType): ITag {
    return this.statuses[status];
  }

  contactSelected(contact: IContactDto, propertyRecord: IPropertyRecord): void {
    propertyRecord.contact = contact;
  }

  propertySelected(
    property: IPropertyDto,
    propertyRecord: IPropertyRecord
  ): void {
    propertyRecord.property = property;
  }

  roleSelected(role: any, propertyRecord: IPropertyRecord): void {
    propertyRecord.role = role.value;
  }

  onRowDelete(propertyRecord: IPropertyRecord) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this property record in ${propertyRecord.property.propertyName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.propertyRecordService
          .deletePropertyRecord(propertyRecord.propertyRecordId!)
          .subscribe({
            next: () => {
              this.notificationService.success(
                'success',
                'Delete: Property record successful deleted'
              );
            },
            error: (error) => {
              this.notificationService.error(
                'error',
                'Delete: Property record failed',
                error
              );
            },
          });
      },
    });
    this.propertyRecordService.getPropertyRecordsFromDB();
  }
}
