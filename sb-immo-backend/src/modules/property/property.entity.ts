import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { PropertyStatusType } from '../enums/property-status.enum';

@Entity('sb_property')
export class PropertyEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'property_id' })
  propertyId: string;

  @Column({ name: 'property_name' })
  propertyName: string;

  // Maybe a house with more families
  @ManyToOne(() => AddressEntity, { eager: true })
  @JoinColumn({ name: 'address_id' })
  address: AddressEntity;

  @Column({ nullable: true })
  unit: string; // maybe with multiple tenants  e.g. 1.O.G.

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
