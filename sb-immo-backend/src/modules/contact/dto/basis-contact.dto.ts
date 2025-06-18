import { ApiProperty } from '@nestjs/swagger';
import { ContactEntity } from '../contact.entity';

export class BasisContactDto {
  @ApiProperty()
  contactId: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
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
