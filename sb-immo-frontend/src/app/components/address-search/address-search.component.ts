import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';

import { AddressService } from '../../services/address.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

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
    PanelModule,
    ListboxModule,
  ],
  templateUrl: './address-search.component.html',
  styleUrl: './address-search.component.scss',
})
export class AddressSearchComponent implements OnInit {
  @Output() addressSelected = new EventEmitter<any>();

  searchControl = new FormControl('');

  constructor(private addressService: AddressService) {}

  get addressesForInput$() {
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

  onAddressSelect(addr: any) {
    this.addressSelected.emit(addr);
  }

  showResultsPanel = false; // 控制面板显示

  // 输入框获得焦点时显示面板
  onInputFocus() {
    if (this.searchControl.value) {
      this.showResultsPanel = true;
    }
  }

  // 输入框失去焦点时隐藏面板（可加延迟避免立即消失）
  onInputBlur() {
    setTimeout(() => {
      this.showResultsPanel = false;
    }, 200);
  }
}
