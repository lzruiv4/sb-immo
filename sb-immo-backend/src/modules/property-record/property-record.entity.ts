import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PropertyEntity } from '../property/property.entity';
import { ContactEntity } from '../contact/contact.entity';
import { RoleType } from '../enums/role.enum';
@Entity('sb_property_record')
export class PropertyRecordEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'property_record_id' })
  propertyRecordId: string;

  @ManyToOne(() => PropertyEntity, { eager: true })
  @JoinColumn({ name: 'property_id' })
  propertyEntity: PropertyEntity;

  @ManyToOne(() => ContactEntity, { eager: true })
  @JoinColumn({ name: 'contact_id' })
  contactEntity: ContactEntity;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.ROLE_OWNER })
  role: RoleType;

  @Column({ type: 'timestamptz', name: 'start_at' })
  startAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'end_at' })
  endAt: Date;

  /**
   * Für Dienstleister: Hier werden alle Dienstleistungen gespeichert
   *
   * Ich bin der Meinung, dass hier einfach als string gespeichert werden kann,
   * da es unterschiedliche Services gibt
   *
   * **/
  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
