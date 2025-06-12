import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create.contact.dto';
import { ContactEntity } from './contact.entity';
import { UpdateContactDto } from './dto/update.contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private contactRepository: Repository<ContactEntity>,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactEntity> {
    const newContactEntity = this.contactRepository.create(dto);
    newContactEntity.createdAt = new Date(); // Set createdAt to current date
    return this.contactRepository.save(newContactEntity);
  }

  async findAll(): Promise<ContactEntity[]> {
    return this.contactRepository.find();
  }

  async findOne(contactId: string): Promise<ContactEntity> {
    const contactEntity = await this.contactRepository.findOne({
      where: { contactId },
    });
    if (!contactEntity) throw new NotFoundException('Contact not found');
    return contactEntity;
  }

  async update(id: string, dto: UpdateContactDto): Promise<ContactEntity> {
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
