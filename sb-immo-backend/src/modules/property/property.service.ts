import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyEntity } from './property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressService } from '../address/address.service';
import { PropertyDto } from './dto/response-property.dto';
import { ResponsePropertyDto } from './dto/property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    private addressService: AddressService,
  ) {}

  async create(dto: PropertyDto): Promise<ResponsePropertyDto> {
    if (!dto.propertyName) {
      dto.propertyName = `${dto.address.street} ${dto.address.houseNumber}, ${dto.address.postcode}, ${dto.address.city}`;
    }
    const newPropertyEntity = this.propertyRepository.create(dto);
    const isDuplicate = await this.addressService.isAddressDuplicate(
      dto.address,
    );
    if (!isDuplicate) {
      const addressEntity = await this.addressService.create(dto.address);
      newPropertyEntity.address = addressEntity; // Set the address relation
    } else {
      const existingAddress = await this.addressService.findOne(dto.address);
      newPropertyEntity.address = existingAddress; // Use existing address
    }
    return ResponsePropertyDto.entityToDto(
      await this.propertyRepository.save(newPropertyEntity),
    );
  }

  async findAll(): Promise<ResponsePropertyDto[]> {
    return (await this.propertyRepository.find()).map((property) =>
      ResponsePropertyDto.entityToDto(property),
    );
  }

  async findOne(propertyId: string): Promise<ResponsePropertyDto> {
    const propertyEntity = await this.propertyRepository.findOne({
      where: { propertyId },
    });
    if (!propertyEntity) throw new NotFoundException('Property not found');
    return ResponsePropertyDto.entityToDto(propertyEntity);
  }

  async update(id: string, dto: PropertyDto): Promise<ResponsePropertyDto> {
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
