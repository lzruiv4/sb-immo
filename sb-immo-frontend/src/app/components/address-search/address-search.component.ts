import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { AddressService } from '../../services/address.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-address-search',
  standalone: true,
  imports: [
    AutoCompleteModule,
    FormsModule,
    InputGroup,
    InputTextModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './address-search.component.html',
  styleUrl: './address-search.component.scss',
})
export class AddressSearchComponent implements OnInit {
  searchControl = new FormControl('');

  constructor(private addressService: AddressService) {}

  get addresses$() {
    return this.addressService.addressesForInput$;
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((value) =>
          this.addressService.getAddressesForInput(value || '')
        )
      )
      .subscribe();
  }
}
