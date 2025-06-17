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
  // controller for edit row
  currentPropertyRecordId: string | null = null;

  loading: boolean = false;
  openCreateDialog: boolean = false;

  statuses = RoleTypeDescriptions;
  defaultDateForm: string = dateFormat;

  constructor(private propertyRecordService: PropertyRecordService) {}

  ngOnInit(): void {
    this.propertyRecordService.getPropertyRecords();
    this.propertyRecordService.propertyRecords$.subscribe();
  }

  get propertyRecords$() {
    return this.propertyRecordService.propertyRecords$;
  }

  openDialog() {
    this.openCreateDialog = true;
  }

  onRowEditInit(propertyRecord: IPropertyRecordDto) {
    this.currentPropertyRecordId = propertyRecord.propertyRecordId ?? null;
    console.log(
      this.currentPropertyRecordId,
      '   ',
      propertyRecord.propertyRecordId
    );
  }

  onRowEditSave(propertyRecord: IPropertyRecordDto) {
    this.propertyRecordService
      .saveNewPropertyRecord(propertyRecord)
      .subscribe();
    this.currentPropertyRecordId = null;
  }

  onRowEditCancel() {
    this.propertyRecordService.getPropertyRecords();
    this.currentPropertyRecordId = null;
  }

  getStatusTag(status: RoleType): ITag {
    return this.statuses[status];
  }
}
