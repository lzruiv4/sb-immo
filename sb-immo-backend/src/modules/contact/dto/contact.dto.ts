import { RoleType } from 'src/modules/enums/role.enum';
import { ContactEntity } from '../contact.entity';

export class ContactDto {
  contactId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: RoleType;
  notes: string;

  static entityToContactDto(entity: ContactEntity): ContactDto {
    return {
      contactId: entity.contactId,
      firstname: entity.firstname,
      lastname: entity.lastname,
      email: entity.email,
      phone: entity.phone,
      role: entity.role,
      notes: entity.notes,
    };
  }
}
