import { PropertyRecordEntity } from '../property-record.entity';
import { BasisPropertyRecordDto } from './basis-property-record.dto';

export class PropertyRecordDto extends BasisPropertyRecordDto {
  propertyRecordId: string;

  static entityToPropertyRecordDto(
    entity: PropertyRecordEntity,
  ): PropertyRecordDto {
    const dto = BasisPropertyRecordDto.entityToBasisPropertyRecordDto(entity);
    return {
      propertyRecordId: entity.propertyRecordId,
      ...dto,
    } as PropertyRecordDto;
  }

  static propertyRecordDtoToEntity(
    dto: PropertyRecordDto,
  ): PropertyRecordEntity {
    return {
      propertyRecordId: dto.propertyRecordId,
      propertyEntity: {}, // Assuming propertyEntity is a reference to a PropertyEntity
      contactEntity: {}, // Assuming contactEntity is a reference to a ContactEntity
      role: dto.role,
      startAt: dto.startAt,
      endAt: dto.endAt,
      notes: dto.notes,
    } as PropertyRecordEntity;
  }
}
