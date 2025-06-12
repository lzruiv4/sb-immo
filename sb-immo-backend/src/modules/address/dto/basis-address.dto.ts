import { AddressEntity } from '../address.entity';

export class BasisAddressDto {
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;

  static entityToBasisAddressDto(entity: AddressEntity): BasisAddressDto {
    return {
      street: entity.street,
      houseNumber: entity.houseNumber,
      postcode: entity.postcode,
      city: entity.city,
    } as BasisAddressDto;
  }
}
