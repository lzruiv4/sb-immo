import { Component, OnInit } from '@angular/core';
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
import { IPropertyRecordDto } from '../../models/dtos/property-record.dto';
import { SearchPropertyComponent } from '../search-property/search-property.component';
import { SearchContactsComponent } from '../search-contacts/search-contacts.component';
import { RoleType, RoleTypeDescriptions } from '../../models/enums/role.enum';
import { BasisCombosComponent } from '../../share/basis-components/basis-combos/basis-combos.component';
import { ITag } from '../../share/models/tag.model';
import { DatePickerModule } from 'primeng/datepicker';
import { dateFormat } from '../../share/models/date.model';
import { PropertyService } from '../../services/property.service';
import { ContactService } from '../../services/contact.service';
import { combineLatest, map, Observable } from 'rxjs';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { IContactDto } from '../../models/dtos/contact.dto';
import { NotificationService } from '../../services/notification.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

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
export class PropertyRecordComponent implements OnInit {
  loading: boolean = false;
  openCreateDialog: boolean = false;

  statuses = RoleTypeDescriptions;
  defaultDateForm: string = dateFormat;

  dataPlusPropertyAndContact$!: Observable<IPropertyRecordDto[]>;

  constructor(
    private propertyRecordService: PropertyRecordService,
    private propertyService: PropertyService,
    private contactService: ContactService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService // service from primeng, show message for delete
  ) {}

  get propertyRecords$() {
    return this.propertyRecordService.propertyRecords$;
  }

  // 这里我用 combineLatest 把三个服务里的 observable（房产记录、房产列表、联系人列表）组合成一个新的数据流。
  // 通过 map 操作，我使用 Map 来快速查找对应的房产和联系人，把原始记录补全成包含完整信息的对象，最后用于展示或进一步处理。
  ngOnInit(): void {
    this.dataPlusPropertyAndContact$ = combineLatest([
      this.propertyRecordService.propertyRecords$,
      this.propertyService.properties$,
      this.contactService.contacts$,
    ]).pipe(
      map(([propertyRecords, properties, contacts]) => {
        const propertyMap = new Map(
          properties.map((property) => [property.propertyId, property])
        );

        const contactMap = new Map(
          contacts.map((contact) => [contact.contactId, contact])
        );

        return propertyRecords.map((record) => ({
          ...record,
          property: propertyMap.get(record.propertyId),
          contact: contactMap.get(record.contactId),
        }));
      })
    );
    this.dataPlusPropertyAndContact$.subscribe();
  }

  openDialog(): void {
    this.openCreateDialog = true;
  }

  onRowEditInit(): void {}

  onRowEditSave(propertyRecord: any): void {
    if (this.propertyRecordService.checkPropertyRecord(propertyRecord)) {
      this.propertyRecordService
        .updatePropertyRecord(propertyRecord.propertyRecordId, propertyRecord)
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
    this.propertyRecordService.getPropertyRecords();
  }

  onRowEditCancel(): void {
    this.propertyRecordService.getPropertyRecords();
  }

  getStatusTag(status: RoleType): ITag {
    return this.statuses[status];
  }

  contactSelected(contact: IContactDto, propertyRecord: any): void {
    propertyRecord.contactId = contact.contactId;
  }

  propertySelected(property: IPropertyDto, propertyRecord: any): void {
    propertyRecord.propertyId = property.propertyId;
  }

  roleSelected(role: any, propertyRecord: any): void {
    propertyRecord.role = role.value;
  }

  onRowDelete(propertyRecord: any) {
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
    this.propertyRecordService.getPropertyRecords();
  }
}
