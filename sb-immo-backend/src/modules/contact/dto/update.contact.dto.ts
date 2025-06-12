export class UpdateContactDto {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: 'EIGENTUEMER' | 'MIETER' | 'DIENSTLEISTER';
  notes?: string;
}
