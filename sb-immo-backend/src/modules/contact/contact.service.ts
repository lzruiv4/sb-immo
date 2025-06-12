import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactEntity } from './contact.entity';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private contactRepository: Repository<ContactEntity>,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactDto> {
    const newContactEntity = this.contactRepository.create(dto);
    newContactEntity.createdAt = new Date(); // Set createdAt to current date
    return ContactDto.entityToContactDto(
      await this.contactRepository.save(newContactEntity),
    );
  }

  async findAll(): Promise<ContactDto[]> {
    return (await this.contactRepository.find()).map((contact) =>
      ContactDto.entityToContactDto(contact),
    );
  }

  async findOne(contactId: string): Promise<ContactDto> {
    const contactEntity = await this.contactRepository.findOne({
      where: { contactId },
    });
    if (!contactEntity) throw new NotFoundException('Contact not found');
    return ContactDto.entityToContactDto(contactEntity);
  }

  async update(id: string, dto: ContactDto): Promise<ContactDto> {
    await this.contactRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Contact not found');
    }
    console.log(`Contact with id ${id} has been deleted.`);
  }
}
