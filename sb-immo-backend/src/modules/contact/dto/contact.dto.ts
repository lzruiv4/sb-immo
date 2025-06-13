import { ContactEntity } from '../contact.entity';
import { BasisContactDto } from './basis-contact.dto';

export class ContactDto extends BasisContactDto {
  notes: string;

  static entityToContactDto(entity: ContactEntity): ContactDto {
    const dto = BasisContactDto.entityToBasisContactDto(entity);
    return {
      ...dto,
      notes: entity.notes,
    };
  }

  static dtoToContactEntity(dto: ContactDto): ContactEntity {
    const entity = new ContactEntity();
    entity.contactId = dto.contactId;
    entity.firstname = dto.firstname;
    entity.lastname = dto.lastname;
    entity.email = dto.email;
    entity.phone = dto.phone;
    entity.notes = dto.notes;
    return entity;
  }
}
