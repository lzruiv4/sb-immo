import { IContactDto } from './dtos/contact.dto';
import { IPropertyDto } from './dtos/property.dto';
import { RoleType } from './enums/role.enum';

export interface CombineLatestModel {
  propertyRecordId?: string;
  property: IPropertyDto;
  contact: IContactDto;
  role: RoleType;
  startAt: Date;
  endAt?: Date; // Optional end date for the record
  notes?: string;
  createdAt: Date;
}
