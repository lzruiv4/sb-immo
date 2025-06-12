import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { ContactEntity } from '../contact/contact.entity';
import { PropertyStatusType } from '../enums/property-statue.enum';

@Entity('sb_property')
export class PropertyEntity {
  @PrimaryGeneratedColumn({ name: 'property_id' })
  propertyId: string;

  @Column({ name: 'property_name' })
  propertyName: string;

  @OneToOne(() => AddressEntity, { eager: true })
  @JoinColumn({ name: 'address_id' })
  address: AddressEntity;

  @Column()
  unit: string; // maybe with multiple tenants  e.g. 1.O.G.

  @ManyToOne(() => ContactEntity, { eager: true })
  @JoinColumn({ name: 'owner_id' })
  owner: ContactEntity;

  @Column('float')
  area: number;

  @Column({ name: 'build_year' })
  buildYear: number;

  @Column({
    type: 'enum',
    enum: PropertyStatusType,
    default: PropertyStatusType.AVAILABLE,
  })
  status: PropertyStatusType;
}
