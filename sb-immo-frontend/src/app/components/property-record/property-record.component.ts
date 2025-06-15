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
import { SearchPropertyComponent } from '../search-propery/search-propery.component';
import { SearchContactsComponent } from '../search-contacts/search-contacts.component';

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
  ],
  templateUrl: './property-record.component.html',
  styleUrl: './property-record.component.scss',
})
export class PropertyRecordComponent implements OnInit {
  loading: boolean = false;
  openCreateDialog: boolean = false;

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

  onRowEditInit() {}

  onRowEditSave(propertyRecord: IPropertyRecordDto) {
    this.propertyRecordService
      .saveNewPropertyRecord(propertyRecord)
      .subscribe();
  }

  onRowEditCancel() {
    this.propertyRecordService.getPropertyRecords();
  }
}
