import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PropertyService } from '../../services/property.service';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ButtonModule } from 'primeng/button';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { PropertyStatusType } from '../../models/enums/property-status.enum';
import { CreatePropertyComponent } from '../create-property/create-property.component';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { IAddressDto } from '../../models/dtos/address.dto';

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
    MultiSelectModule,
    SelectModule,
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

  constructor(
    private propertyService: PropertyService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.propertyService.getProperties();
    this.propertyService.properties$.subscribe();
    // console.log(this.statusOptions);
  }

  get properties$() {
    return this.propertyService.properties$;
  }

  openCreateDialog = false;

  openDialog() {
    this.openCreateDialog = true;
  }

  onRowEditInit() {}

  onRowEditSave(property: IPropertyDto) {
    this.propertyService.updateProperty(property).subscribe();
  }

  onRowEditCancel() {
    this.propertyService.getProperties();
  }

  setupStatus: Record<PropertyStatusType, { label: string; severity: string }> =
    {
      [PropertyStatusType.AVAILABLE]: {
        label: 'AVAILABLE',
        severity: 'success',
      },
      [PropertyStatusType.MAINTENANCE]: {
        label: 'MAINTENANCE',
        severity: 'warning',
      },
      [PropertyStatusType.RENTED]: { label: 'RENTED', severity: 'info' },
    };

  getStatusTag(status: any): { label: string; severity: string } | undefined {
    return this.setupStatus[status as PropertyStatusType];
  }

  onAddressChosen(address: IAddressDto, property: IPropertyDto) {
    property.address = {
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
