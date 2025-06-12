export class CreateContactDto {
  firstname: string;
  lastname: string;
  email: string;
  password?: string; // Optional field for password
  phone: string;
  role: 'EIGENTUEMER' | 'MIETER' | 'DIENSTLEISTER';
  notes?: string;
}
