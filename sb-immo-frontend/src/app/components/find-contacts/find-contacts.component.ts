import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { RelevantContactService } from '../../services/relevant-contact.service';
import { filter, map, Observable } from 'rxjs';
import { ISearchRelevantContact } from '../../share/models/search-relevant-contacts';
import { CommonModule } from '@angular/common';
import { CardShowComponent } from '../../share/basis-components/card-show/card-show.component';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IPropertyRecord } from '../../models/property-record.model';
import { CardModule } from 'primeng/card';
import { dateFormatYMD } from '../../share/models/date.model';

@Component({
  selector: 'app-find-contacts',
  imports: [
    Dialog,
    CommonModule,
    CardModule,
    CardShowComponent,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './find-contacts.component.html',
  styleUrl: './find-contacts.component.scss',
})
export class FindContactsComponent implements OnInit {
  @Input() visible = false;
  @Input() contactId: string = '';
  @Output() closeDialog = new EventEmitter<void>();
  defaultDateForm: string = dateFormatYMD;

  constructor(private relevantContactService: RelevantContactService) {}

  selectedPropertyRecord!: IPropertyRecord | null;

  data$!: Observable<Map<IPropertyRecord, ISearchRelevantContact>>;

  relevantPropertyRecord$!: Observable<IPropertyRecord[]>;
  selectedContactDetails$!: Observable<ISearchRelevantContact> | null;

  ngOnInit(): void {
    this.data$ =
      this.relevantContactService.getRelevantPropertyRecordsByContactId(
        this.contactId
      );

    this.relevantPropertyRecord$ = this.data$?.pipe(
      map((map) => Array.from(map.keys()))
    );
  }

  onSelectRecord(pr: IPropertyRecord): void {
    this.selectedPropertyRecord = pr;
    this.selectedContactDetails$ = this.data$.pipe(
      map((map) => map.get(pr)!),
      filter((val): val is ISearchRelevantContact => !!val)
    );
  }

  onCancel() {
    this.closeDialog.emit();
  }
}
