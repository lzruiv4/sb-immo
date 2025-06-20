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
import { BasisCombosComponent } from '../../share/basis-components/basis-combos/basis-combos.component';
import { IAddressDto } from '../../models/dtos/address.dto';
import { NotificationService } from '../../services/notification.service';

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

  constructor(
    private propertyService: PropertyService,
    private notificationService: NotificationService
  ) {}

  onSubmit(ngForm: NgForm) {
    this.propertyService.saveNewProperty(this.property).subscribe({
      next: (response) => {
        this.closeDialog.emit();
        ngForm.resetForm();
        this.propertyService.getProperties();
        this.notificationService.success(
          'success',
          'Create property successful'
        );
      },
      error: (error) => {
        this.notificationService.error(
          'error',
          'Create property failed',
          error
        );
      },
    });
  }

  onCancel(ngForm: NgForm) {
    this.closeDialog.emit();
    ngForm.resetForm();
  }

  onAddressChosen(address: IAddressDto): void {
    // 合并新旧地址（避免破坏表单绑定）
    this.property.address = {
      ...this.property.address, // 保留原有字段
      ...address, // 覆盖新字段
    };
  }
}
