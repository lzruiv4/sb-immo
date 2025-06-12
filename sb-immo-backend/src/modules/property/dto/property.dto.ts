import { AddressDto } from '../../address/dto/address.dto';
import { BasisContactDto } from '../../contact/dto/basis-contact.dto';
import { PropertyStatusType } from '../../enums/property-statue.enum';
import { PropertyEntity } from '../property.entity';

export class ResponsePropertyDto {
  propertyId: string;
  propertyName: string;
  address: AddressDto;
  unit: string;
  owner: BasisContactDto;
  area: number;
  buildYear: number;
  status: PropertyStatusType;

  static entityToDto(entity: PropertyEntity): ResponsePropertyDto {
    return {
      propertyId: entity.propertyId,
      propertyName: entity.propertyName,
      address: AddressDto.entityToDto(entity.address),
      unit: entity.unit,
      owner: BasisContactDto.entityToBasisContactDto(entity.owner),
      area: entity.area,
      buildYear: entity.buildYear,
      status: entity.status,
    } as ResponsePropertyDto;
  }
}
