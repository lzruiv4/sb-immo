import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';
import { AddressSearchComponent } from "../../components/address-search/address-search.component";

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, MenuBarComponent, AddressSearchComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss',
})
export class HomeLayoutComponent {}
