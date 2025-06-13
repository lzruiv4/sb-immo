import { RoleType } from 'src/modules/enums/role.enum';
import { PropertyRecordEntity } from '../property-record.entity';

export class BasisPropertyRecordDto {
  propertyId: string;
  contactId: string;
  role: RoleType;
  startAt: Date;
  endAt?: Date; // Optional end date for the record
  notes?: string;

  static entityToBasisPropertyRecordDto(
    entity: PropertyRecordEntity,
  ): BasisPropertyRecordDto {
    return {
      propertyId: entity.propertyEntity.propertyId,
      contactId: entity.contactEntity.contactId,
      role: entity.role,
      startAt: entity.startAt, // Default to now if not set
      endAt: entity.endAt,
      notes: entity.notes,
    };
  }
}
