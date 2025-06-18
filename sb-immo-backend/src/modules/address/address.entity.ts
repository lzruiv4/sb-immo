import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('sb_immo_address')
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

  @Column({ length: 100 })
  street: string;

  @Column({ length: 10 })
  houseNumber: string;

  @Column({ length: 10 })
  postcode: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50, nullable: true })
  district: string; // Holweide

  @Column({ length: 50, nullable: true })
  state: string; // NRW

  @Column({ length: 50 })
  country: string;

  @Column({ length: 2 })
  countryCode: string; //e.g. DE for Germany
}
