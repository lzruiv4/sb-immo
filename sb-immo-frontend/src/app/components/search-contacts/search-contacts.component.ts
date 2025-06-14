import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search-contacts',
  imports: [Dialog, ButtonModule],
  templateUrl: './search-contacts.component.html',
  styleUrl: './search-contacts.component.scss',
})
export class SearchContactsComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
