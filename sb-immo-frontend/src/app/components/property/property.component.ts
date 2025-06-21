import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PropertyService } from '../../services/property.service';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IPropertyDto } from '../../models/dtos/property.dto';
import {
  PropertyStatusDescriptions,
  PropertyStatusType,
} from '../../models/enums/property-status.enum';
import { CreatePropertyComponent } from '../create-property/create-property.component';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { IAddressDto } from '../../models/dtos/address.dto';
import { ITag } from '../../share/models/tag.model';
import { NotificationService } from '../../services/notification.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-property',
  imports: [
    AvatarModule,
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    CommonModule,
    ButtonModule,
    CreatePropertyComponent,
    AddressSearchComponent,
    ToastModule,
  ],
  templateUrl: './property.component.html',
  styleUrl: './property.component.scss',
})
export class PropertyComponent implements OnInit {
  loading: boolean = false;

  addressId: number = 0;

  setupStatus = PropertyStatusDescriptions;

  constructor(
    private propertyService: PropertyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  get properties$() {
    return this.propertyService.properties$;
  }

  openCreateDialog = false;

  openDialog() {
    this.openCreateDialog = true;
  }

  onRowEditInit(property: IPropertyDto) {
    console.log('Open', property);
  }

  onRowEditSave(property: IPropertyDto) {
    if (this.propertyService.isPropertyDuplicated(property)) {
      this.notificationService.warn('warn', 'Update: Property is duplicated');
    } else {
      this.propertyService.updateProperty(property).subscribe({
        next: (response) => {
          this.notificationService.success(
            'success',
            'Update: Property successful'
          );
        },
        error: (error) => {
          this.notificationService.error(
            'error',
            'Update: Property failed',
            error
          );
        },
      });
    }
    this.propertyService.getProperties();
  }

  onRowEditCancel(property: IPropertyDto) {
    this.propertyService.getProperties();
  }

  getStatusTag(status: PropertyStatusType): ITag {
    return this.setupStatus[status];
  }

  onAddressChosen(address: IAddressDto, property: IPropertyDto) {
    property.address = {
      addressId: property.address.addressId,
      street: address.street || '',
      houseNumber: address.houseNumber || '',
      postcode: address.postcode || '',
      city: address.city || '',
      district: address.district || '',
      state: address.state || '',
      country: address.country || '',
      countryCode: address.countryCode || '',
    };
  }
}
