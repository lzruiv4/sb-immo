import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyRecordEntity } from './property-record.entity';
import { Repository } from 'typeorm';
import { ContactService } from '../contact/contact.service';
import { PropertyRecordDto } from './dto/property-record.dto';
import { BasisPropertyRecordDto } from './dto/basis-property-record.dto';
import { PropertyService } from '../property/property.service';
import { PropertyDto } from '../property/dto/property.dto';
import { ContactDto } from '../contact/dto/contact.dto';

@Injectable()
export class PropertyRecordService {
  constructor(
    @InjectRepository(PropertyRecordEntity)
    private propertyRecordRepository: Repository<PropertyRecordEntity>,
    private propertyService: PropertyService,
    private contactService: ContactService,
  ) {}

  async create(dto: BasisPropertyRecordDto): Promise<PropertyRecordDto> {
    const propertyDto = await this.propertyService.findOne(dto.propertyId);
    if (!propertyDto)
      throw new NotFoundException(
        'Property not found, please create a property first',
      );

    const contactDto = await this.contactService.findOne(dto.contactId);
    if (!contactDto)
      throw new NotFoundException(
        'Contact not found, please create a contact first',
      );

    const newPropertyRecordEntity = this.propertyRecordRepository.create(dto);
    newPropertyRecordEntity.propertyEntity =
      PropertyDto.dtoToPropertyEntity(propertyDto);

    newPropertyRecordEntity.contactEntity =
      ContactDto.dtoToContactEntity(contactDto);

    return PropertyRecordDto.entityToPropertyRecordDto(
      await this.propertyRecordRepository.save(newPropertyRecordEntity),
    );
  }

  async findAll(): Promise<PropertyRecordDto[]> {
    return (await this.propertyRecordRepository.find()).map((propertyRecord) =>
      PropertyRecordDto.entityToPropertyRecordDto(propertyRecord),
    );
  }

  async findAllByContactId(contactId: string): Promise<PropertyRecordDto[]> {
    return (
      await this.propertyRecordRepository.find({
        where: { contactEntity: { contactId: contactId } },
      })
    ).map((propertyRecord) =>
      PropertyRecordDto.entityToPropertyRecordDto(propertyRecord),
    );
  }

  async findAllByPropertyId(
    propertyRecordId: string,
  ): Promise<PropertyRecordDto[]> {
    return (await this.propertyRecordRepository.find())
      .filter((record) => record.propertyEntity.propertyId === propertyRecordId)
      .map((propertyRecord) =>
        PropertyRecordDto.entityToPropertyRecordDto(propertyRecord),
      );
  }

  async findOne(propertyRecordId: string): Promise<PropertyRecordDto> {
    const propertyRecordEntity = await this.propertyRecordRepository.findOne({
      where: { propertyRecordId },
    });
    if (!propertyRecordEntity)
      throw new NotFoundException('Property record not found');
    return PropertyRecordDto.entityToPropertyRecordDto(propertyRecordEntity);
  }

  async update(
    propertyRecordId: string,
    dto: PropertyRecordDto,
  ): Promise<PropertyRecordDto> {
    const propertyRecordEntity = await this.propertyRecordRepository.findOne({
      where: { propertyRecordId },
    });
    if (!propertyRecordEntity)
      throw new NotFoundException('Property record not found');
    else {
      // Ensure the dto contains the necessary fields
      if (!dto.propertyId || !dto.contactId) {
        throw new NotFoundException(
          'Property ID and Contact ID must be provided for update',
        );
      }
      // Validate that the property and contact exist
      const propertyEntity = PropertyDto.dtoToPropertyEntity(
        await this.propertyService.findOne(dto.propertyId),
      );
      if (!propertyEntity)
        throw new NotFoundException('Property not found for update');
      const contactEntity = ContactDto.dtoToContactEntity(
        await this.contactService.findOne(dto.contactId),
      );
      if (!contactEntity)
        throw new NotFoundException('Contact not found for update');
      const updateEntity = PropertyRecordDto.propertyRecordDtoToEntity(dto);
      updateEntity.propertyEntity = propertyEntity;
      updateEntity.contactEntity = contactEntity;
      await this.propertyRecordRepository.update(
        propertyRecordId,
        updateEntity,
      );
      return this.findOne(propertyRecordId);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyRecordRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Property record not found');
    }
    console.log(`Property record with id ${id} has been deleted.`);
  }
}
