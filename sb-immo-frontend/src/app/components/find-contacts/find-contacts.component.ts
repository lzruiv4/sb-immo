import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { RelevantContactService } from '../../services/relevant-contact.service';
import { Observable } from 'rxjs';
import { ISearchRelevantContact } from '../../share/models/search-relevant-contacts';
import { CommonModule } from '@angular/common';
import { CardShowComponent } from '../../share/basis-components/card-show/card-show.component';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-find-contacts',
  imports: [Dialog, CommonModule, CardShowComponent, ButtonModule, TagModule],
  templateUrl: './find-contacts.component.html',
  styleUrl: './find-contacts.component.scss',
})
export class FindContactsComponent implements OnInit {
  @Input() visible = false;
  @Input() contactId: string = '';
  @Output() closeDialog = new EventEmitter<void>();

  constructor(private relevantContactService: RelevantContactService) {}

  contacts$: Observable<ISearchRelevantContact> | undefined;

  ngOnInit(): void {
    this.contacts$ = this.relevantContactService.getRelevantContactByContactId(
      this.contactId
    );
  }

  onCancel() {
    this.closeDialog.emit();
  }
}
