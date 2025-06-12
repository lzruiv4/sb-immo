import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('sb-immo_address')
@Unique([
  'street',
  'houseNumber',
  'postcode',
  'city',
  'district',
  'state',
  'country',
])
export class AddressEntity {
  @PrimaryGeneratedColumn({ name: 'address_id' })
  addressId: number;

  @Column({ length: 100, nullable: true })
  street: string;

  @Column({ length: 10, nullable: true })
  houseNumber: string;

  @Column({ length: 10, nullable: true })
  postcode: string;

  @Column({ length: 50, nullable: true })
  city: string;

  @Column({ length: 50 })
  district: string; // Holweide

  @Column({ length: 50 })
  state: string; // NRW

  @Column({ length: 50, nullable: true })
  country: string;

  @Column({ length: 2, nullable: true })
  countryCode: string; //e.g. DE for Germany
}
