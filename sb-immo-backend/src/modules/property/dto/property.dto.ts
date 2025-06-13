import { AddressDto } from 'src/modules/address/dto/address.dto';
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

  static dtoToPropertyEntity(dto: PropertyDto): PropertyEntity {
    const entity = new PropertyEntity();
    entity.propertyId = dto.propertyId;
    entity.propertyName = dto.propertyName;
    entity.unit = dto.unit;
    entity.area = dto.area;
    entity.buildYear = dto.buildYear;
    entity.status = dto.status;
    entity.address = AddressDto.dtoToAddressEntity(dto.address);
    return entity;
  }
}
