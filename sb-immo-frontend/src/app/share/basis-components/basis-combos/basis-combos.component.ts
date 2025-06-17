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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TagModule } from 'primeng/tag';
import { ITag } from '../../models/tag.model';
import { PropertyStatusType } from '../../../models/enums/property-status.enum';
import { RoleType } from '../../../models/enums/role.enum';

@Component({
  selector: 'app-basis-combos',
  imports: [AutoCompleteModule, CommonModule, FormsModule, TagModule],
  templateUrl: './basis-combos.component.html',
  styleUrls: ['./basis-combos.component.scss'],
})
export class BasisCombosComponent<T extends PropertyStatusType | RoleType>
  implements OnChanges, OnInit
{
  @Input() suggestions!: Record<T, ITag>;
  @Input() current: T | null = null;
  @Output() statusSelected = new EventEmitter<any>();

  filteredStatuses: any[] = [];
  selectedStatus: T | null = null;

  statusOptions: { value: T; label: string; severity: string }[] = [];

  ngOnInit(): void {
    if (this.current) this.selectedStatus = this.current;
  }

  ngOnChanges() {
    if (this.suggestions) {
      this.statusOptions = Object.keys(this.suggestions).map((key: string) => ({
        value: key as T,
        label: this.suggestions[key as T].label,
        severity: this.suggestions[key as T].severity,
      }));
    }
  }

  // 过滤方法
  filterStatus(event: { query: string }) {
    this.filteredStatuses = this.getFilteredStatuses(event.query);
  }

  private getFilteredStatuses(query: string) {
    return this.statusOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(query.toLowerCase()) ||
        option.value.toString().toLowerCase().includes(query.toLowerCase())
    );
  }
}
