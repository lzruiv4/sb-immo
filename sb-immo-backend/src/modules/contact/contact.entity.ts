import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('sb_contact')
export class ContactEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'contact_id' })
  contactId: string;

  @Column({ length: 20 })
  firstname: string;

  @Column({ length: 20 })
  lastname: string;

  @Column()
  email: string;

  // TODO: add password field
  // @Column()
  // password: string;

  @Column()
  phone: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  notes: string;
}
