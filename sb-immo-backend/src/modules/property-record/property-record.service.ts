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

@Injectable()
export class PropertyRecordService {
  constructor(
    @InjectRepository(PropertyRecordEntity)
    private propertyRecordRepository: Repository<PropertyRecordEntity>,
    private propertyService: PropertyService,
    private contactService: ContactService,
  ) {}

  /**
   * Creates a new property record based on the provided data transfer object (DTO).
   *
   * - Initializes status and retrieves related property and contact information.
   * - Restricts creation if the role is a renter and the property is not available.
   * - Associates the property and contact entities with the new property record.
   * - Updates the property name and saves the new property record to the repository.
   *
   * @param dto - The data transfer object containing the details for the new property record.
   * @returns A promise that resolves to the created property record DTO.
   * @throws BadRequestException when the renter and the property is unavailable.
   */
  async create(dto: BasisPropertyRecordDto): Promise<PropertyRecordDto> {
    // Only used in systems with small data volumes
    await this.setupStatus();
    const propertyDto = await this.propertyService.findOne(dto.propertyId);
    const contactDto = await this.contactService.findOne(dto.contactId);

    // Only the tenant's actions are restricted.
    if (
      RoleType.ROLE_RENTER === dto.role &&
      propertyDto.status !== PropertyStatusType.AVAILABLE &&
      dto.contactId != contactDto.contactId
    ) {
      throw new BadRequestException(
        'CREATE_PROPERTY_RECORD: The property is unavailable.',
      );
    } else {
      this.createPropertyRecordByRole(dto, propertyDto);
      dto.createdAt = new Date();
      const newPropertyRecordEntity = this.propertyRecordRepository.create(dto);
      newPropertyRecordEntity.propertyEntity =
        PropertyDto.dtoToPropertyEntity(propertyDto);

      newPropertyRecordEntity.contactEntity =
        ContactDto.dtoToContactEntity(contactDto);
      // Make sure propertyName is not empty
      await this.propertyService.updatePropertyName(propertyDto);
      return PropertyRecordDto.entityToPropertyRecordDto(
        await this.propertyRecordRepository.save(newPropertyRecordEntity),
      );
    }
  }

  private createPropertyRecordByRole(
    propertyRecordDto: BasisPropertyRecordDto,
    propertyDto: PropertyDto,
  ): void {
    if (propertyRecordDto.role === RoleType.ROLE_RENTER) {
      propertyDto.status = PropertyStatusType.RENTED;
    }
    if (
      propertyRecordDto.role === RoleType.ROLE_SERVICE &&
      propertyDto.status === PropertyStatusType.AVAILABLE
    ) {
      // Only property in AVAILABLE can change the status to MAINTENANCE
      propertyDto.status = PropertyStatusType.MAINTENANCE;
    }
  }

  /**
   * When setting the property status,
   * - As a service provider
   *     -> can ignore whether there are tenants;  --> PropertyStatusType.MAINTENANCE
   * - As an owner, the property status doesn't matter either.
   *     --> PropertyStatusType.AVAILABLE
   * - Only as a renter is the property's availability relevant
   *     --> PropertyStatusType.RENTED
   */
  async setupStatus(): Promise<void> {
    try {
      const properties = await this.propertyService.findAll();
      for (const property of properties) {
        await this.updatePropertyStatusByDate(property);
      }
    } catch (error) {
      console.error('Error in setupStatus:', error);
      throw error;
    }
  }

  async updatePropertyStatusByDate(property: PropertyDto): Promise<void> {
    try {
      const propertyRecords = await this.findAllByPropertyId(
        property.propertyId,
      );
      const rightNow = new Date();

      const activeRecords = propertyRecords.filter(
        (record) =>
          rightNow >= record.startAt &&
          (!record.endAt || rightNow <= record.endAt),
      );
      if (
        activeRecords.length === 0 ||
        activeRecords.every((record) => record.role == RoleType.ROLE_OWNER)
      ) {
        property.status = PropertyStatusType.AVAILABLE;
      } else if (
        activeRecords.some((record) => record.role == RoleType.ROLE_SERVICE)
      ) {
        property.status = PropertyStatusType.MAINTENANCE;
      } else {
        property.status = PropertyStatusType.RENTED;
      }
      await this.propertyService.update(property.propertyId, property);
    } catch (error) {
      console.error(
        `UPDATE_PROPERTY_STATUS: Error updating property ${property.propertyId}:`,
        error,
      );
      throw error;
    }
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
      throw new NotFoundException(
        'GET_PROPERTY_RECORD: Property record not found',
      );
    return PropertyRecordDto.entityToPropertyRecordDto(propertyRecordEntity);
  }

  /**
   * Update data.
   * The front end take the address from database,
   * so there is no need to update the property data(where the property ==> address) and contacts.
   */
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
          'UPDATE_PROPERTY_RECORD: Property ID and Contact ID must be provided',
        );
      }
      // Validate that the property and contact exist
      const propertyEntity = PropertyDto.dtoToPropertyEntity(
        await this.propertyService.findOne(dto.propertyId),
      );
      if (!propertyEntity)
        throw new NotFoundException(
          'UPDATE_PROPERTY_RECORD: Property not found',
        );

      const contactEntity = ContactDto.dtoToContactEntity(
        await this.contactService.findOne(dto.contactId),
      );
      if (!contactEntity)
        throw new NotFoundException(
          'UPDATE_PROPERTY_RECORD: Contact not found',
        );

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
    console.log(
      `REMOVE_PROPERTY_RECORD: Property record with id ${id} has been deleted.`,
    );
  }
}
