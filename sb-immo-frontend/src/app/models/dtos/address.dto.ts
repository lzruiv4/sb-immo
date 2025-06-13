export interface IAddressDto {
  addressId: number;
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  district?: string;
  state?: string;
  country: string;
  countryCode: string;

  // static entityToAddressDto(entity: AddressEntity): AddressDto {
  //   const basisDto = BasisAddressDto.entityToBasisAddressDto(entity);
  //   return {
  //     addressId: entity.addressId,
  //     ...basisDto,
  //     district: entity.district,
  //     state: entity.state,
  //     country: entity.country,
  //     countryCode: entity.countryCode,
  //   } as AddressDto;
  // }

  // static dtoToAddressEntity(dto: AddressDto): AddressEntity {
  //   const entity = new AddressEntity();
  //   entity.addressId = dto.addressId;
  //   entity.street = dto.street;
  //   entity.houseNumber = dto.houseNumber;
  //   entity.postcode = dto.postcode;
  //   entity.city = dto.city;
  //   entity.district = dto.district || '';
  //   entity.state = dto.state || '';
  //   entity.country = dto.country;
  //   entity.countryCode = dto.countryCode;
  //   return entity;
  // }
}
