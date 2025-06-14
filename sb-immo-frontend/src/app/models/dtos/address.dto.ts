export interface IAddressDto {
  addressId?: number;
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  district?: string;
  state?: string;
  country: string;
  countryCode: string;
}
