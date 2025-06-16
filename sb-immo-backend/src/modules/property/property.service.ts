import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!dto.propertyName) {
      this.setupPropertyName(dto);
    }
    const newPropertyEntity = this.propertyRepository.create(dto);
    const isDuplicate = await this.addressService.isAddressDuplicate(
      dto.address,
    );
    if (!isDuplicate) {
      const addressDto = await this.addressService.create(dto.address);
      newPropertyEntity.address = AddressDto.dtoToAddressEntity(addressDto); // Set the address relation
    } else {
      const existingAddress = await this.addressService.findOne(
        dto.address.addressId,
      );
      newPropertyEntity.address =
        AddressDto.dtoToAddressEntity(existingAddress); // Use existing address
    }
    return PropertyDto.entityToDto(
      await this.propertyRepository.save(newPropertyEntity),
    );
  }

  private setupPropertyName(dto: BasisPropertyDto): string {
    return (dto.propertyName = `${dto.address.street} ${dto.address.houseNumber}, ${dto.address.postcode}, ${dto.address.city}`);
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
    const tempAddress = await this.addressService.update(
      dto.address.addressId,
      dto.address,
    );
    dto.address = tempAddress;
    if (!dto.propertyName || dto.propertyName.trim() === '') {
      dto.propertyName = this.setupPropertyName(dto);
    }
    await this.propertyRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Property not found');
    }
    console.log(`Property with id ${id} has been deleted.`);
  }
}
