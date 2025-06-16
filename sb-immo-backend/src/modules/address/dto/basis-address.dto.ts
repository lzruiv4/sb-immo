import { AddressEntity } from '../address.entity';

export class BasisAddressDto {
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  district?: string;
  state?: string;
  country: string;
  countryCode: string;

  static entityToBasisAddressDto(entity: AddressEntity): BasisAddressDto {
    return {
      street: entity.street,
      houseNumber: entity.houseNumber,
      postcode: entity.postcode,
      city: entity.city,
      district: entity.district,
      state: entity.state,
      country: entity.country,
      countryCode: entity.countryCode,
    } as BasisAddressDto;
  }

  static dtoToAddressEntity(dto: BasisAddressDto): AddressEntity {
    const entity = new AddressEntity();
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
