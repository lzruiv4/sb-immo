import { ContactEntity } from '../contact.entity';

export class BasisContactDto {
  contactId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;

  static entityToBasisContactDto(entity: ContactEntity): BasisContactDto {
    return {
      contactId: entity.contactId,
      firstname: entity.firstname,
      lastname: entity.lastname,
      email: entity.email,
      phone: entity.phone,
    };
  }
}
