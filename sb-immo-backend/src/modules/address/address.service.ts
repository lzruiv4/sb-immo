import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { AddressDto } from './dto/address.dto';
import { BasisAddressDto } from './dto/basis-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async create(dto: AddressDto): Promise<AddressEntity> {
    const exists = await this.isAddressDuplicate({
      street: dto.street,
      houseNumber: dto.houseNumber,
      postcode: dto.postcode,
      city: dto.city,
    } as BasisAddressDto);
    if (exists) {
      console.log('Address is already exists:', dto);
      return this.findOne(dto);
    } else {
      console.log('Creating new address:', dto);
      const address = this.addressRepository.create(dto);
      return this.addressRepository.save(address);
    }
  }

  async findAll(): Promise<AddressEntity[]> {
    return await this.addressRepository.find();
  }

  async findOne(dto: AddressDto): Promise<AddressEntity> {
    const addressEntity = await this.addressRepository
      .createQueryBuilder('property')
      .where('LOWER(TRIM(property.street)) = :street', {
        street: dto.street.toLowerCase().trim(),
      })
      .andWhere('TRIM(property.houseNumber) = :houseNumber', {
        houseNumber: dto.houseNumber.trim(),
      })
      .andWhere('TRIM(property.postcode) = :postcode', {
        postcode: dto.postcode.trim(),
      })
      .andWhere('LOWER(TRIM(property.city)) = :city', {
        city: dto.city.toLowerCase().trim(),
      })
      .getOne();
    if (!addressEntity) throw new NotFoundException('Address not found');
    return addressEntity;
  }

  async update(id: number, dto: AddressDto): Promise<AddressEntity> {
    await this.addressRepository.update(id, dto);
    return this.findOne(dto);
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
    console.log(`Address with id ${id} has been deleted.`);
  }

  async isAddressDuplicate(dto: BasisAddressDto): Promise<boolean> {
    const normalizedStreet = dto.street.toLowerCase().trim();
    console.log(0, 'Checking for duplicate address:');
    const found = await this.addressRepository
      .createQueryBuilder('property')
      .where('LOWER(TRIM(property.street)) = :street', {
        street: normalizedStreet,
      })
      .andWhere('TRIM(property.houseNumber) = :houseNumber', {
        houseNumber: dto.houseNumber.trim(),
      })
      .andWhere('TRIM(property.postcode) = :postcode', {
        postcode: dto.postcode.trim(),
      })
      .getOne();
    return !!found;
  }
}
