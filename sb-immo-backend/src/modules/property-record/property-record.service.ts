import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyRecordEntity } from './property-record.entity';
import { Repository } from 'typeorm';
import { ContactService } from '../contact/contact.service';
import { PropertyRecordDto } from './dto/property-record.dto';
import { BasisPropertyRecordDto } from './dto/basis-property-record.dto';
import { PropertyService } from '../property/property.service';
import { PropertyDto } from '../property/dto/property.dto';
import { ContactDto } from '../contact/dto/contact.dto';
import { PropertyStatusType } from '../enums/property-status.enum';
import { RoleType } from '../enums/role.enum';

interface RoleWithDates {
  role: RoleType;
  startAt: Date;
  endAt?: Date;
}

//  const properties = await this.propertyRepository.find();
//     return await Promise.all(
//       properties.map(async (property) => {
//         await this.updatePropertyStatusByDate(property);
//         return property;
//       }),
//     );
@Injectable()
export class PropertyRecordService {
  constructor(
    @InjectRepository(PropertyRecordEntity)
    private propertyRecordRepository: Repository<PropertyRecordEntity>,
    private propertyService: PropertyService,
    private contactService: ContactService,
  ) {}

  async create(dto: BasisPropertyRecordDto): Promise<PropertyRecordDto> {
    await this.setupStatus();
    const propertyDto = await this.propertyService.findOne(dto.propertyId);
    const contactDto = await this.contactService.findOne(dto.contactId);
    // Only the tenant's actions are restricted.
    if (
      RoleType.ROLE_MIETER === dto.role &&
      propertyDto.status !== PropertyStatusType.AVAILABLE
    ) {
      throw new BadRequestException(
        'CREATE_PROPERTY_RECORD: The property is unavailable.',
      );
    } else {
      this.createPropertyRecordByRole(dto, propertyDto);
      const newPropertyRecordEntity = this.propertyRecordRepository.create(dto);
      newPropertyRecordEntity.propertyEntity =
        PropertyDto.dtoToPropertyEntity(propertyDto);

      newPropertyRecordEntity.contactEntity =
        ContactDto.dtoToContactEntity(contactDto);
      await this.propertyService.update(propertyDto.propertyId, propertyDto);
      return PropertyRecordDto.entityToPropertyRecordDto(
        await this.propertyRecordRepository.save(newPropertyRecordEntity),
      );
    }
  }

  private createPropertyRecordByRole(
    propertyRecordDto: BasisPropertyRecordDto,
    propertyDto: PropertyDto,
  ): void {
    if (propertyRecordDto.role === RoleType.ROLE_MIETER) {
      propertyDto.status = PropertyStatusType.RENTED;
    }
    if (
      propertyRecordDto.role === RoleType.ROLE_DIENSTLEISTER &&
      propertyDto.status === PropertyStatusType.AVAILABLE
    ) {
      // Only property in AVAILABLE can change the status to MAINTENANCE
      propertyDto.status = PropertyStatusType.MAINTENANCE;
    }
    propertyRecordDto.createdAt = new Date();
  }

  async setupStatus(): Promise<void> {
    const properties = await this.propertyService.findAll();
    await Promise.all(
      properties.map(async (property) => {
        await this.updatePropertyStatusByDate(property);
        return property;
      }),
    );
  }

  async updatePropertyStatusByDate(property: PropertyDto): Promise<void> {
    const propertyRecords = await this.findAllByPropertyId(property.propertyId);
    const rightNow = new Date();
    let records: RoleWithDates[] = propertyRecords
      .map((record) => {
        return {
          role: record.role,
          startAt: record.startAt,
          endAt: record.endAt,
        } as RoleWithDates;
      })
      .filter(
        (record) =>
          rightNow >= record.startAt &&
          (!record.endAt || rightNow <= record.endAt),
      );
    console.log('++++++++++++', records);
    if (records.some((record) => RoleType.ROLE_DIENSTLEISTER === record.role)) {
      property.status = PropertyStatusType.MAINTENANCE;
    } else if (records.some((record) => RoleType.ROLE_MIETER === record.role)) {
      property.status = PropertyStatusType.RENTED;
    } else {
      property.status = PropertyStatusType.AVAILABLE;
    }
    await this.propertyService.update(property.propertyId, property);
    records = [];
  }

  async findAll(): Promise<PropertyRecordDto[]> {
    await this.setupStatus();
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
    await this.setupStatus();
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
