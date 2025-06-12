import { RoleType } from 'src/modules/enums/role.enum';

export class UpdateContactDto {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: RoleType;
  notes?: string;
}
