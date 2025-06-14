import { PropertyStatusType } from '../enums/property-status.enum';
import { IAddressDto } from './address.dto';

export interface IPropertyDto {
  propertyId?: string;
  propertyName: string;
  address: IAddressDto;
  unit: string;
  area: number;
  buildYear: number;
  status: PropertyStatusType;
}
