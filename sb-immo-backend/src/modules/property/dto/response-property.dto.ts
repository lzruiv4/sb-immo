import { AddressDto } from '../../address/dto/address.dto';
import { BasisContactDto } from '../../contact/dto/basis-contact.dto';
import { PropertyStatusType } from '../../enums/property-statue.enum';
import { PropertyEntity } from '../property.entity';

export class PropertyDto {
  propertyName: string;
  address: AddressDto;
  unit: string;
  owner: BasisContactDto;
  area: number;
  buildYear: number;
  status: PropertyStatusType;

  static entityToDto(entity: PropertyEntity): PropertyDto {
    return {
      propertyName: entity.propertyName,
      address: AddressDto.entityToDto(entity.address),
      unit: entity.unit,
      owner: BasisContactDto.entityToBasisContactDto(entity.owner),
      area: entity.area,
      buildYear: entity.buildYear,
      status: entity.status,
    };
  }
}
