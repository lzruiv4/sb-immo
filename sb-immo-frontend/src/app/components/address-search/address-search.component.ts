import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';

import { AddressService } from '../../sevices/address.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-address-search',
  standalone: true,
  imports: [
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
    return this.addressService.addresses$;
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => this.addressService.getAddresses(value || ''))
      )
      .subscribe();
  }
}
