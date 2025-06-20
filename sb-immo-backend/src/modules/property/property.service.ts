import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyEntity } from './property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressService } from '../address/address.service';
import { BasisPropertyDto } from './dto/create-property.dto';
import { PropertyDto } from './dto/property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    private addressService: AddressService,
  ) {}

  async create(dto: BasisPropertyDto): Promise<PropertyDto> {
    // Check the register address and plus unit
    if (await this.isPropertyRegister(dto)) {
      throw new ConflictException(
        'CREATE_PROPERTY: Address is already register, maybe in an other unit',
      );
    } else {
      // check property name is empty
      if (!dto.propertyName || dto.propertyName.trim() === '') {
        this.setupPropertyName(dto);
      }

      // Setup address for property
      await this.setupPropertyAddress(dto);

      const newPropertyEntity = this.propertyRepository.create(dto);

      return PropertyDto.entityToDto(
        await this.propertyRepository.save(newPropertyEntity),
      );
    }
  }

  private async setupPropertyAddress(dto: BasisPropertyDto) {
    const addressInSystem = await this.addressService.findAddressWithBasisInfo(
      dto.address,
    );
    if (!addressInSystem) {
      const addressDto = await this.addressService.create(dto.address);
      dto.address = addressDto; // Set the address relation
    } else {
      dto.address = addressInSystem;
    }
  }

  /**
   * Checks if the address has been registered.
   * If the propertyId is the same, it will return false.
   * Another is true
   */
  private async isPropertyRegister(
    dto: BasisPropertyDto,
    propertyId?: string,
  ): Promise<boolean> {
    const properties = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.address', 'address')
      .where('address.street = :street', { street: dto.address.street })
      .andWhere('address.houseNumber = :houseNumber', {
        houseNumber: dto.address.houseNumber,
      })
      .andWhere('address.postcode = :postcode', {
        postcode: dto.address.postcode,
      })
      .andWhere('property.unit = :unit', {
        unit: dto.unit,
      });

    if (propertyId) {
      properties.andWhere('property.propertyId != :propertyId', {
        propertyId: propertyId,
      });
    }
    return await properties.getExists();
  }

  private setupPropertyName(dto: BasisPropertyDto): string {
    return (dto.propertyName = `${dto.address.street} ${dto.address.houseNumber},
    ${dto.unit === '' ? '' : ' ' + dto.unit + ','} ${dto.address.postcode}, ${dto.address.city}`);
  }

  async findAll(): Promise<PropertyDto[]> {
    return (await this.propertyRepository.find()).map((property) =>
      PropertyDto.entityToDto(property),
    );
  }

  async findOne(propertyId: string): Promise<PropertyDto> {
    const propertyEntity = await this.propertyRepository.findOne({
      where: { propertyId },
    });
    if (!propertyEntity)
      throw new NotFoundException('GET_PROPERTY_BY_ID: Property not found');
    return PropertyDto.entityToDto(propertyEntity);
  }

  async updatePropertyName(dto: PropertyDto): Promise<void> {
    if (!dto.propertyName || dto.propertyName.trim() === '') {
      dto.propertyName = this.setupPropertyName(dto);
    }
    await this.propertyRepository.update(dto.propertyId, dto);
  }

  async update(propertyId: string, dto: PropertyDto): Promise<PropertyDto> {
    // Just check if the property is in the database
    const checkAddressWithUnitRegister = await this.isPropertyRegister(
      dto,
      dto.propertyId,
    );

    if (checkAddressWithUnitRegister) {
      throw new ConflictException(
        `UPDATE_PROPERTY: The address with id ${dto.address.addressId} is registered`,
      );
    }

    await this.setupPropertyAddress(dto);

    // check property name is empty
    if (!dto.propertyName || dto.propertyName.trim() === '') {
      this.setupPropertyName(dto);
    }
    await this.propertyRepository.update(propertyId, dto);
    return this.findOne(propertyId);
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Property not found');
    }
    console.log(`Property with id ${id} has been deleted.`);
  }
}
