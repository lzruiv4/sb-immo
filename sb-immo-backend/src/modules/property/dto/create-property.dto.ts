import { PropertyStatusType } from 'src/modules/enums/property-status.enum';
import { AddressDto } from '../../address/dto/address.dto';
import { PropertyEntity } from '../property.entity';

export class BasisPropertyDto {
  propertyName: string;
  address: AddressDto;
  unit: string;
  area: number;
  buildYear: number;
  status: PropertyStatusType;

  static entityToDto(entity: PropertyEntity): BasisPropertyDto {
    return {
      propertyName: entity.propertyName,
      address: AddressDto.entityToAddressDto(entity.address),
      unit: entity.unit,
      area: entity.area,
      buildYear: entity.buildYear,
      status: entity.status,
    };
  }
}
