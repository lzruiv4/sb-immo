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
import { AddressDto } from './address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  createUser(@Body() dto: AddressDto) {
    return this.addressService.create(dto);
  }

  @Get()
  testConnection() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.addressService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: AddressDto) {
    return this.addressService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
