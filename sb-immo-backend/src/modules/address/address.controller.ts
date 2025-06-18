import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Address')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  createAddress(@Body() dto: AddressDto): Promise<AddressDto> {
    return this.addressService.create(dto);
  }

  @Get()
  findAllAddresses(): Promise<AddressDto[]> {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<AddressDto> {
    return this.addressService.findOne(id);
  }

  @Put(':id')
  updateAddress(
    @Param('id') id: number,
    @Body() dto: AddressDto,
  ): Promise<AddressDto> {
    return this.addressService.update(id, dto);
  }

  @Delete(':id')
  removeAddress(@Param('id') id: string): Promise<void> {
    return this.addressService.remove(id);
  }
}
