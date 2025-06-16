import { AddressEntity } from '../address.entity';
import { BasisAddressDto } from './basis-address.dto';

export class AddressDto extends BasisAddressDto {
  addressId: number;

  static entityToAddressDto(entity: AddressEntity): AddressDto {
    const basisDto = BasisAddressDto.entityToBasisAddressDto(entity);
    return {
      addressId: entity.addressId,
      ...basisDto,
    } as AddressDto;
  }

  static dtoToAddressEntity(dto: AddressDto): AddressEntity {
    const entity = new AddressEntity();
    entity.addressId = dto.addressId;
    entity.street = dto.street;
    entity.houseNumber = dto.houseNumber;
    entity.postcode = dto.postcode;
    entity.city = dto.city;
    entity.district = dto.district || '';
    entity.state = dto.state || '';
    entity.country = dto.country;
    entity.countryCode = dto.countryCode;
    return entity;
  }
}
