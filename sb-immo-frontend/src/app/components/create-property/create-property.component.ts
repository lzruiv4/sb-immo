import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { IPropertyDto } from '../../models/dtos/property.dto';
import {
  PropertyStatusDescriptions,
  PropertyStatusType,
} from '../../models/enums/property-status.enum';
import { PropertyService } from '../../services/property.service';
import { TagModule } from 'primeng/tag';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BasisCombosComponent } from '../../share/basis-combos/basis-combos.component';

@Component({
  selector: 'app-create-property',
  imports: [
    AddressSearchComponent,
    DialogModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    AutoCompleteModule,
    TagModule,
    BasisCombosComponent,
  ],
  templateUrl: './create-property.component.html',
  styleUrl: './create-property.component.scss',
})
export class CreatePropertyComponent {
  @Input() visible = false;
  @Output() closeDialog = new EventEmitter<void>();

  statuses = PropertyStatusDescriptions;

  property: IPropertyDto = {
    propertyName: '',
    address: {
      street: '',
      houseNumber: '',
      postcode: '',
      city: '',
      district: '',
      state: '',
      country: '',
      countryCode: '',
    },
    unit: '',
    area: 0,
    buildYear: 0,
    status: PropertyStatusType.AVAILABLE,
  };

  constructor(private propertyService: PropertyService) {}

  onSubmit(ngForm: NgForm) {
    this.propertyService.saveNewProperty(this.property).subscribe();
    this.closeDialog.emit();
    ngForm.resetForm();
  }

  onCancel(ngForm: NgForm) {
    this.closeDialog.emit();
    ngForm.resetForm();
  }

  onAddressChosen(address: any) {
    this.property.address = {
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
