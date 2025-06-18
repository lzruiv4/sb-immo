import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-search-property',
  imports: [AutoCompleteModule, CommonModule, FormsModule],
  templateUrl: './search-property.component.html',
  styleUrl: './search-property.component.scss',
})
export class SearchPropertyComponent implements OnInit, OnChanges {
  @Input() current: IPropertyDto | null = null;
  @Input() name: string = '';
  @Output() selectedProperty = new EventEmitter<IPropertyDto>();

  value: IPropertyDto | null = null;

  constructor(private propertyService: PropertyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['current']) {
      this.value = this.current;
    }
  }

  ngOnInit(): void {
    if (this.current) this.value = this.current;
  }

  data: any[] = [];

  search(event: AutoCompleteCompleteEvent) {
    const input = event.query.toLowerCase();

    this.propertyService.properties$.subscribe((properties) => {
      this.data = properties.filter(
        (property) =>
          property.propertyName.toLowerCase().includes(input) ||
          property.address.street.toLowerCase().includes(input) ||
          property.address.postcode.toLowerCase().includes(input) ||
          property.address.city.toLowerCase().includes(input)
      );
    });
  }

  selectProperty(event: AutoCompleteSelectEvent) {
    const property: IPropertyDto = event.value as IPropertyDto;
    this.selectedProperty.emit(property);
  }
}
