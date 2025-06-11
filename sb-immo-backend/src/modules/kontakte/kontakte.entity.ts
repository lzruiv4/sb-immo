import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sb_kontakte')
export class KontakteEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'kontakte_id' })
  kontakteId: string;

  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  lastname: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: ['EIGENTUEMER', 'MIETER', 'DIENSTLEISTER'] })
  role: 'EIGENTUEMER' | 'MIETER' | 'DIENSTLEISTER';

  @Column({ type: 'timestamptz', nullable: true, name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  notes: string;
}
