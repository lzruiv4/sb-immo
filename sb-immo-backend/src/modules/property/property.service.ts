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
import { AddressDto } from '../address/dto/address.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    private addressService: AddressService,
  ) {}

  async create(dto: BasisPropertyDto): Promise<PropertyDto> {
    if ((await this.getPropertyCountInSystem(dto)) > 0) {
      console.log('check property');
      throw new ConflictException('Property is already in system');
    } else {
      // check property name is empty
      if (!dto.propertyName || dto.propertyName.trim() === '') {
        this.setupPropertyName(dto);
      }
      const newPropertyEntity = this.propertyRepository.create(dto);

      const duplicateAddressesCount =
        await this.addressService.getAddressDuplicateCount(
          dto.address.street,
          dto.address.houseNumber,
          dto.address.postcode,
        );
      // check address maybe in system
      if (duplicateAddressesCount === 0) {
        const addressDto = await this.addressService.create(dto.address);
        newPropertyEntity.address = AddressDto.dtoToAddressEntity(addressDto); // Set the address relation
      } else {
        const existingAddress =
          await this.addressService.findAddressWithBasisInfo(dto.address);
        newPropertyEntity.address =
          AddressDto.dtoToAddressEntity(existingAddress); // Use existing address
      }
      return PropertyDto.entityToDto(
        await this.propertyRepository.save(newPropertyEntity),
      );
    }
  }

  private async getPropertyCountInSystem(
    dto: BasisPropertyDto,
  ): Promise<number> {
    const count = await this.propertyRepository
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
      })
      .getCount();
    return count;
  }

  private setupPropertyName(dto: BasisPropertyDto): string {
    return (dto.propertyName = `${dto.address.street} ${dto.address.houseNumber},${dto.unit === '' ? '' : ' ' + dto.unit + ','} ${dto.address.postcode}, ${dto.address.city}`);
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
    if (!propertyEntity) throw new NotFoundException('Property not found');
    return PropertyDto.entityToDto(propertyEntity);
  }

  async update(id: string, dto: PropertyDto): Promise<PropertyDto> {
    const checkAddressRegister = await this.getPropertyCountInSystem(dto);
    if (checkAddressRegister > 0) {
      throw new ConflictException(
        `The address with id ${dto.address.addressId} is registered`,
      );
    } else {
      const checkAddressInSystemCount =
        await this.addressService.getAddressDuplicateCount(
          dto.address.street,
          dto.address.houseNumber,
          dto.address.postcode,
        );
      if (checkAddressInSystemCount === 0) {
        const newAddress = await this.addressService.create(dto.address);
        dto.address = newAddress;
      } else {
        const updateAddress = await this.addressService.update(
          dto.address.addressId,
          dto.address,
        );

        dto.address = updateAddress;
      }
      if (!dto.propertyName || dto.propertyName.trim() === '') {
        dto.propertyName = this.setupPropertyName(dto);
      }

      await this.propertyRepository.update(id, dto);
      return this.findOne(id);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Property not found');
    }
    console.log(`Property with id ${id} has been deleted.`);
  }
}
