import { RoleType } from 'src/modules/enums/role.enum';

export class CreateContactDto {
  firstname: string;
  lastname: string;
  email: string;
  password?: string; // Optional field for password
  phone: string;
  role: RoleType;
  notes?: string;
}
