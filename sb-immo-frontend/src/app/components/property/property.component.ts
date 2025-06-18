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
  ],
  templateUrl: './property.component.html',
  styleUrl: './property.component.scss',
})
export class PropertyComponent implements OnInit {
  loading: boolean = false;

  addressId: number = 0;

  setupStatus = PropertyStatusDescriptions;

  constructor(private propertyService: PropertyService) {}

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
    console.log('产业在组件内====', property);
    // Clone the property and its address to avoid mutating shared references
    // const updatedProperty: IPropertyDto = {
    //   ...property,
    //   address: {
    //     ...property.address,
    //     addressId: this.addressId,
    //   },
    // };
    this.propertyService.updateProperty(property).subscribe();
  }

  onRowEditCancel(property: IPropertyDto) {
    this.propertyService.getProperties();
  }

  getStatusTag(status: PropertyStatusType): ITag {
    return this.setupStatus[status];
  }

  onAddressChosen(address: IAddressDto, property: IPropertyDto) {
    console.log('+', property, ',,,,', address);
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
    // Object.assign(property, address);
    // property = { ...property, address };
  }
}
