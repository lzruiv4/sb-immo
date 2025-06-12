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

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  createAddress(@Body() dto: AddressDto) {
    return this.addressService.create(dto);
  }

  @Get()
  findAllAddresses() {
    return this.addressService.findAll();
  }

  // @Get()
  // findOne(@Body() dto: BasisAddressDto) {
  //   return this.addressService.findOne(dto);
  // }

  @Put(':id')
  updateAddress(@Param('id') id: number, @Body() dto: AddressDto) {
    return this.addressService.update(id, dto);
  }

  @Delete(':id')
  removeAddress(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
