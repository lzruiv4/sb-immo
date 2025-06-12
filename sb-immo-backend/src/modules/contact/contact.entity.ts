import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleType } from '../enums/role.enum';

@Entity('sb_contact')
export class ContactEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'contact_id' })
  contactId: string;

  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  lastname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.ROLE_EIGENTUEMER })
  role: RoleType;

  @Column({ type: 'timestamptz', nullable: true, name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  notes: string;
}
