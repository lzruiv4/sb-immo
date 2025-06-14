import { RoleType } from "../enums/role.enum";

export interface IPropertyRecordDto {
  propertyRecordId: string;
  propertyId: string;
  contactId: string;
  role: RoleType;
  startAt: Date; 
  endAt?: Date; // Optional end date for the record
  notes?: string;
}
