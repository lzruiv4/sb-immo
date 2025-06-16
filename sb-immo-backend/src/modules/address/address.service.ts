import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(dto: AddressDto): Promise<AddressDto> {
    const exists = await this.isAddressDuplicate({
      street: dto.street,
      houseNumber: dto.houseNumber,
      postcode: dto.postcode,
      city: dto.city,
    } as BasisAddressDto);
    if (exists) {
      console.log('Address is already exists:', dto);
      return this.findOne(dto.addressId);
    } else {
      console.log('Creating new address:', dto);
      const address = this.addressRepository.create(dto);
      return AddressDto.entityToAddressDto(
        await this.addressRepository.save(address),
      );
    }
  }

  async findAll(): Promise<AddressDto[]> {
    return (await this.addressRepository.find()).map((address) =>
      AddressDto.entityToAddressDto(address),
    );
  }

  async findOne(addressId: number): Promise<AddressDto> {
    // TODO: Maybe find address by street
    // const addressEntity = await this.addressRepository
    //   .createQueryBuilder('property')
    //   .where('LOWER(TRIM(property.street)) = :street', {
    //     street: dto.street.toLowerCase().trim(),
    //   })
    //   .andWhere('TRIM(property.houseNumber) = :houseNumber', {
    //     houseNumber: dto.houseNumber.trim(),
    //   })
    //   .andWhere('TRIM(property.postcode) = :postcode', {
    //     postcode: dto.postcode.trim(),
    //   })
    //   .andWhere('LOWER(TRIM(property.city)) = :city', {
    //     city: dto.city.toLowerCase().trim(),
    //   })
    //   .getOne();
    const addressEntity = await this.addressRepository.findOne({
      where: {
        addressId,
      },
    });
    if (!addressEntity) throw new NotFoundException('Address not found');
    return AddressDto.entityToAddressDto(addressEntity);
  }

  async update(id: number, dto: AddressDto): Promise<AddressDto> {
    console.log('id:', id, 'dto', dto);
    if (id === undefined) {
      console.log('id not');
      const found = await this.isAddressDuplicate({
        street: dto.street,
        houseNumber: dto.houseNumber,
        postcode: dto.postcode,
        city: dto.city,
      } as BasisAddressDto);
      if (!found) {
        return this.create(dto);
      } else {
        throw new BadRequestException('Address is already save');
      }
    } else {
      await this.addressRepository.update(id, dto);
      return await this.findOne(id);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
    console.log(`Address with id ${id} has been deleted.`);
  }

  private isAddressChanged(
    oldAddress: AddressDto,
    newAddressPartial: Partial<AddressDto>,
  ): boolean {
    if (!oldAddress || !newAddressPartial) return false;

    return [
      'street',
      'number',
      'city',
      'postcode',
      'country',
      'countryCode',
    ].some(
      (key) =>
        newAddressPartial[key] !== undefined &&
        newAddressPartial[key] !== oldAddress[key],
    );
  }

  async isAddressDuplicate(dto: BasisAddressDto): Promise<AddressDto | null> {
    const normalizedStreet = dto.street.toLowerCase().trim();
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
    return found ?? null;
  }
}
