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
import { SearchPropertyComponent } from '../search-property/search-propery.component';
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
  ],
  standalone: true,
  templateUrl: './property-record.component.html',
  styleUrl: './property-record.component.scss',
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
    private contactService: ContactService
  ) {}

  get propertyRecords$() {
    return this.propertyRecordService.propertyRecords$;
  }

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

  openDialog() {
    this.openCreateDialog = true;
  }

  onRowEditInit(propertyRecord: any) {}

  onRowEditSave(propertyRecord: any) {
    this.propertyRecordService
      .saveNewPropertyRecord(propertyRecord)
      .subscribe(() => this.propertyRecordService.getPropertyRecords());
  }

  onRowEditCancel() {
    this.propertyRecordService.getPropertyRecords();
  }

  getStatusTag(status: RoleType): ITag {
    return this.statuses[status];
  }

  contactSelected(contact: IContactDto, propertyRecord: any) {
    propertyRecord.contactId = contact.contactId;
  }

  propertySelected(property: IPropertyDto, propertyRecord: any) {
    propertyRecord.propertyId = property.propertyId;
  }
}
