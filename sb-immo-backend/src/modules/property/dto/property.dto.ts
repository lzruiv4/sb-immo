import { PropertyEntity } from '../property.entity';
import { BasisPropertyDto } from './create-property.dto';

export class PropertyDto extends BasisPropertyDto {
  propertyId: string;

  static entityToDto(entity: PropertyEntity): PropertyDto {
    const dto = BasisPropertyDto.entityToDto(entity);
    return {
      propertyId: entity.propertyId,
      ...dto,
    } as PropertyDto;
  }
}
