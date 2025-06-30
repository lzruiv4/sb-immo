import { IContactDto } from './dtos/contact.dto';
import { IPropertyRecordDto } from './dtos/property-record.dto';
import { IPropertyDto } from './dtos/property.dto';
import { RoleType } from './enums/role.enum';

export interface IPropertyRecord {
  propertyRecordId?: string;
  property: IPropertyDto;
  contact: IContactDto;
  role: RoleType;
  startAt: Date;
  endAt?: Date;
  notes?: string;
  createdAt?: Date;
}

export function modelToDto(model: IPropertyRecord): IPropertyRecordDto {
  return {
    propertyRecordId: model.propertyRecordId,
    propertyId: model.property.propertyId,
    contactId: model.contact.contactId,
    role: model.role,
    startAt: model.startAt,
    endAt: model.endAt,
    notes: model.notes,
    createdAt: model.createdAt,
  } as IPropertyRecordDto;
}
