import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('sb_contact')
export class ContactEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'contact_id' })
  contactId: string;

  @Column({ length: 20 })
  firstname: string;

  @Column({ length: 20 })
  lastname: string;

  @Column({ nullable: true })
  email: string;

  // TODO: add password field
  // @Column()
  // password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  notes: string;
}
