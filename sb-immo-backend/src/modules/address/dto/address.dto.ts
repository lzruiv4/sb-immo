import { AddressEntity } from '../address.entity';

export class AddressDto {
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  district?: string;
  state?: string;
  country: string;
  countryCode: string;

  static entityToDto(entity: AddressEntity): AddressDto {
    return {
      street: entity.street,
      houseNumber: entity.houseNumber,
      postcode: entity.postcode,
      city: entity.city,
      district: entity.district,
      state: entity.state,
      country: entity.country,
      countryCode: entity.countryCode,
    } as AddressDto;
  }
}
