import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';

import { AddressService } from '../../services/address.service';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-address-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputGroup,
    InputTextModule,
    ButtonModule,
    PanelModule,
    ListboxModule,
  ],
  templateUrl: './address-search.component.html',
  styleUrl: './address-search.component.scss',
})
export class AddressSearchComponent implements OnInit {
  @Input() oldAddress? = '';
  @Output() addressSelected = new EventEmitter<any>();

  searchControl = new FormControl('');
  addresses: any[] = [];

  constructor(private addressService: AddressService) {}

  get addressesForInput$() {
    return this.addressService.addressesForInput$;
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value || value.trim() === '') {
            this.showResultsPanel = false;
            this.addresses = [];
            return of([]);
          }
          return this.addressService.getAddressesForInput(value);
        })
      )
      .subscribe((results) => {
        this.addresses = results;
        this.showResultsPanel = results && results.length > 0;
      });
  }

  onAddressSelect(addr: any) {
    this.addressSelected.emit(addr);
    this.showResultsPanel = false; // 选择后关闭面板
  }

  showResultsPanel = false;

  onInputFocus() {
    if (this.addresses.length > 0) {
      this.showResultsPanel = true;
    }
  }

  onInputBlur() {
    // 延迟关闭，避免点击面板时被误关闭
    setTimeout(() => {
      this.showResultsPanel = false;
    }, 200);
  }
}
