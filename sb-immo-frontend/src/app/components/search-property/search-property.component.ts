import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IPropertyDto } from '../../models/dtos/property.dto';
import { PropertyService } from '../../services/property.service';
import { BasisDataCombosComponent } from '../../share/basis-components/basis-data-combos/basis-data-combos.component';
import { filter, map, take } from 'rxjs';
import { PropertyStatusType } from '../../models/enums/property-status.enum';

@Component({
  selector: 'app-search-property',
  imports: [BasisDataCombosComponent],
  templateUrl: './search-property.component.html',
})
export class SearchPropertyComponent implements OnChanges {
  @Input() property!: IPropertyDto;
  @Input() name: string = '';
  @Output() selectedProperty = new EventEmitter<IPropertyDto>();

  value: IPropertyDto | null = null;
  data: IPropertyDto[] = [];

  filterProperties = (property: IPropertyDto, input: string) =>
    property.propertyName.toLowerCase().includes(input) ||
    property.address.street.toLowerCase().includes(input) ||
    property.address.postcode.toLowerCase().includes(input) ||
    property.address.city.toLowerCase().includes(input);

  constructor(private propertyService: PropertyService) {
    this.propertyService.properties$
      .pipe(
        take(1),
        map((properties) =>
          properties.filter(
            (property) => property.status === PropertyStatusType.AVAILABLE
          )
        )
      )
      .subscribe((properties) => (this.data = properties));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property']) {
      this.property = this.property;
    }
  }

  selectProperty(property: IPropertyDto) {
    this.selectedProperty.emit(property);
  }
}
