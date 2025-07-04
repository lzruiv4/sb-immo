import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { TagModule } from 'primeng/tag';
import { ITag } from '../../models/tag.model';
import { PropertyStatusType } from '../../../models/enums/property-status.enum';
import { RoleType } from '../../../models/enums/role.enum';

@Component({
  selector: 'app-basis-combos',
  imports: [AutoCompleteModule, CommonModule, FormsModule, TagModule],
  templateUrl: './basis-combos.component.html',
})
export class BasisCombosComponent<T extends PropertyStatusType | RoleType>
  implements OnChanges, OnInit
{
  @Input() suggestions!: Record<T, ITag>;
  @Input() current: T | null = null;
  @Output() statusSelected = new EventEmitter<T>();

  filteredStatuses: any[] = [];
  selectedStatus: T | null = null;

  statusOptions: { value: T; label: string; severity: string }[] = [];

  ngOnInit(): void {
    if (this.current) this.selectedStatus = this.current;
  }

  ngOnChanges(): void {
    if (this.suggestions) {
      this.statusOptions = Object.keys(this.suggestions).map((key: string) => ({
        value: key as T,
        label: this.suggestions[key as T].label,
        severity: this.suggestions[key as T].severity,
      }));
    }
  }

  filterStatus(event: { query: string }): void {
    this.filteredStatuses = this.getFilteredStatuses(event.query);
  }

  selected(event: AutoCompleteSelectEvent): void {
    const item: T = event.value as T;
    this.statusSelected.emit(item);
  }

  private getFilteredStatuses(query: string) {
    return this.statusOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(query.toLowerCase()) ||
        option.value.toString().toLowerCase().includes(query.toLowerCase())
    );
  }
}
