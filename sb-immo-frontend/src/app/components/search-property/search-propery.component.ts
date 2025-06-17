import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { map, Observable } from 'rxjs';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-search-property',
  imports: [AutoCompleteModule, CommonModule, FormsModule],
  templateUrl: './search-property.component.html',
  styleUrl: './search-property.component.scss',
})
export class SearchPropertyComponent {
  @Input() current: IPropertyDto | null = null;
  @Output() selectedProperty = new EventEmitter<IPropertyDto>();

  items$: Observable<IPropertyDto[]> = new Observable<IPropertyDto[]>();

  value: IPropertyDto | null = null;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    if (this.current) this.value = this.current;
    this.propertyService.getProperties();
    this.propertyService.properties$.subscribe();
  }

  search(event: AutoCompleteCompleteEvent) {
    const input = event.query.toLowerCase();
    this.items$ = this.propertyService.properties$.pipe(
      map((properties) =>
        properties.filter(
          (property) =>
            property.propertyName.toLowerCase().includes(input) ||
            property.address.street.toLowerCase().includes(input) ||
            property.address.postcode.toLowerCase().includes(input) ||
            property.address.city.toLowerCase().includes(input)
        )
      )
    );
  }

  selectProperty(event: AutoCompleteSelectEvent) {
    // console.log(event.value);
    const property: IPropertyDto = event.value as IPropertyDto;
    this.selectedProperty.emit(property);
  }
}
