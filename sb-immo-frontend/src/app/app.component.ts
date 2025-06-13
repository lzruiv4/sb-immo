import { Component } from '@angular/core';
import { AddressSearchComponent } from './components/address-search/address-search.component';

@Component({
  selector: 'app-root',
  imports: [AddressSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sb-immo-frontend';
}
