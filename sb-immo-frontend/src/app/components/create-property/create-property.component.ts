import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { PropertyStatusType } from '../../models/enums/property-status.enum';
import { PropertyService } from '../../services/property.service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { AutoCompleteModule } from 'primeng/autocomplete';

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
  ],
  templateUrl: './create-property.component.html',
  styleUrl: './create-property.component.scss',
})
export class CreatePropertyComponent implements OnInit {
  @Input() visible = false;
  @Input() setupStatus: Record<
    PropertyStatusType,
    { label: string; severity: string }
  > = {
    [PropertyStatusType.AVAILABLE]: { label: 'AVAILABLE', severity: 'success' },
    [PropertyStatusType.MAINTENANCE]: {
      label: 'MAINTENANCE',
      severity: 'warning',
    },
    [PropertyStatusType.RENTED]: { label: 'RENTED', severity: 'info' },
  };
  @Output() closeDialog = new EventEmitter<void>();

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

  ngOnInit(): void {
    console.log('asfa', this.setupStatus);
  }

  onSubmit() {
    this.propertyService.saveNewProperty(this.property).subscribe();
    this.visible = false;
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
    console.log('Selected:', address);
  }

  statusOptions = Object.keys(this.setupStatus).map((key: string) => ({
    value: key as PropertyStatusType,
    label: this.setupStatus[key as PropertyStatusType].label,
    severity: this.setupStatus[key as PropertyStatusType].severity,
  }));

  filteredStatuses: any[] = [];
  selectedStatus: {
    value: PropertyStatusType;
    label: string;
    severity: string;
  } | null = null;

  // 过滤方法
  filterStatus(event: { query: string }) {
    this.filteredStatuses = this.statusOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(event.query.toLowerCase()) ||
        option.value
          .toString()
          .toLowerCase()
          .includes(event.query.toLowerCase())
    );
  }

  // 复用父组件的获取状态标签方法
  getStatusTag(status: PropertyStatusType) {
    return this.setupStatus[status];
  }

  // 值改变时的类型安全处理
  onStatusChange(status: {
    value: PropertyStatusType;
    label: string;
    severity: string;
  }) {
    console.log('Selected status:', status.value);
    // 可以在这里触发父组件的回调等操作
  }
}
