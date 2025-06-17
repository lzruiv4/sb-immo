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
import { IAddressDto } from '../../models/dtos/address.dto';

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
  @Input() oldAddress: string = '';
  @Output() addressSelected = new EventEmitter<IAddressDto>();

  searchControl = new FormControl('');
  addresses: IAddressDto[] = [];
  showResultsPanel = false;
  private ignoreNextValueChange = false;

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    if (this.oldAddress) {
      this.searchControl.setValue(this.oldAddress);
    }
    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((value) => {
          if (this.ignoreNextValueChange) {
            this.ignoreNextValueChange = false;
            return of([]);
          }
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
        this.showResultsPanel = results.length > 0;
      });
  }

  onAddressSelect(address: IAddressDto) {
    this.ignoreNextValueChange = true;
    this.searchControl.setValue(address.street, { emitEvent: true });
    this.showResultsPanel = false;
    this.addressSelected.emit(address);
  }
}
