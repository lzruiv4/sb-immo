import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { IPropertyDto } from '../../../models/dtos/property.dto';
import { IContactDto } from '../../../models/dtos/contact.dto';
import { IPropertyRecord } from '../../../models/property-record.model';

@Component({
  selector: 'app-basis-data-combos',
  imports: [AutoCompleteModule, CommonModule, FormsModule, CommonModule],
  templateUrl: './basis-data-combos.component.html',
})
export class BasisDataCombosComponent<
  T extends IPropertyDto | IContactDto | IPropertyRecord
> implements OnInit, OnChanges
{
  @ContentChild('item', { static: false, read: TemplateRef })
  itemTemplate!: TemplateRef<any>;

  @Input() inputModel!: T;
  @Input() name: string = '';
  @Input() data: T[] = [];
  @Input() filterFn!: (item: T, query: string) => boolean;
  @Output() selectedItem = new EventEmitter<T>();

  model!: T;

  ngOnInit(): void {
    this.model = this.inputModel;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputModel']) {
      this.model = this.inputModel ?? null;
    }
  }

  search(event: AutoCompleteCompleteEvent): void {
    this.data = this.data.filter((item) => this.filterFn(item, event.query));
  }

  selected(event: AutoCompleteSelectEvent): void {
    const item: T = event.value as T;
    this.selectedItem.emit(item);
  }
}
