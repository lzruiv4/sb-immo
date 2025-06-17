import {
  BadRequestException,
  ConflictException,
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

  async create(dto: BasisAddressDto): Promise<AddressDto> {
    const count = await this.getAddressDuplicateCount(
      dto.street,
      dto.houseNumber,
      dto.postcode,
    );
    if (count > 0) {
      throw new ConflictException('Address is already in system');
    } else {
      const addressEntity = this.addressRepository.create(
        BasisAddressDto.dtoToAddressEntity(dto),
      );
      return AddressDto.entityToAddressDto(
        await this.addressRepository.save(addressEntity),
      );
    }
  }

  async findAll(): Promise<AddressDto[]> {
    return (await this.addressRepository.find()).map((address) =>
      AddressDto.entityToAddressDto(address),
    );
  }

  async findOne(addressId: number): Promise<AddressDto> {
    const addressEntity = await this.addressRepository.findOne({
      where: {
        addressId,
      },
    });
    if (!addressEntity) throw new NotFoundException('Address not found');
    return AddressDto.entityToAddressDto(addressEntity);
  }

  async findAddressWithBasisInfo(
    basisAddressDto: BasisAddressDto,
  ): Promise<AddressDto | null> {
    const addressEntity = await this.addressRepository
      .createQueryBuilder('address')
      .where('address.street = :street', { street: basisAddressDto.street })
      .andWhere('address.houseNumber = :houseNumber', {
        houseNumber: basisAddressDto.houseNumber,
      })
      .andWhere('address.postcode = :postcode', {
        postcode: basisAddressDto.postcode,
      })
      .getOne();

    return !addressEntity ? null : AddressDto.entityToAddressDto(addressEntity);
  }

  async update(id: number, dto: AddressDto): Promise<AddressDto> {
    // Here can only
    if (id == dto.addressId) {
      if (await this.isAddressChanged(dto)) {
        await this.addressRepository.update(id, dto);
      }
      return await this.findOne(id);
    } else {
      throw new BadRequestException(
        'UPDATE_ADDRESS: You input address is not in system, please create a new address',
      );
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
    console.log(`Address with id ${id} has been deleted.`);
  }

  async isAddressChanged(
    newAddressPartial: Partial<AddressDto>,
  ): Promise<boolean> {
    if (
      !newAddressPartial ||
      newAddressPartial.addressId === undefined ||
      newAddressPartial.addressId === null
    ) {
      return false;
    }

    const oldAddress = await this.findOne(newAddressPartial.addressId);
    if (!oldAddress) return false;

    return [
      'street',
      'houseNumber',
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

  async getAddressDuplicateCount(
    street: string,
    houseNumber: string,
    postcode: string,
  ): Promise<number> {
    const found = await this.addressRepository
      .createQueryBuilder('address')
      .where('LOWER(TRIM(address.street)) = :street', {
        street: street.toLowerCase().trim(),
      })
      .andWhere('TRIM(address.houseNumber) = :houseNumber', {
        houseNumber: houseNumber.trim(),
      })
      .andWhere('TRIM(address.postcode) = :postcode', {
        postcode: postcode.trim(),
      })
      .getCount();
    return found;
  }
}
