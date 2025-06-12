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
}
