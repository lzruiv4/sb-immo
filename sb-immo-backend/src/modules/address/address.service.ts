import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { AddressDto } from './address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async create(dto: AddressDto): Promise<AddressEntity> {
    const newAddressEntity = this.addressRepository.create(dto);
    return this.addressRepository.save(newAddressEntity);
  }

  async findAll(): Promise<AddressEntity[]> {
    return this.addressRepository.find();
  }

  async findOne(addressId: number): Promise<AddressEntity> {
    const addressEntity = await this.addressRepository.findOne({
      where: { addressId },
    });
    if (!addressEntity) throw new NotFoundException('Address not found');
    return addressEntity;
  }

  async update(id: number, dto: AddressDto): Promise<AddressEntity> {
    await this.addressRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
    console.log(`Address with id ${id} has been deleted.`);
  }
}
