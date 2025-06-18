import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyDto } from './dto/property.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Property')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  createProperty(@Body() dto: PropertyDto) {
    return this.propertyService.create(dto);
  }

  @Get()
  findAllProperties() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Put(':id')
  updateProperty(@Param('id') id: string, @Body() dto: PropertyDto) {
    return this.propertyService.update(id, dto);
  }

  @Delete(':id')
  removeProperty(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
