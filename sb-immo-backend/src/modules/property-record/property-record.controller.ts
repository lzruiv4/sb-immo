import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PropertyRecordService } from './property-record.service';
import { BasisPropertyRecordDto } from './dto/basis-property-record.dto';
import { PropertyRecordDto } from './dto/property-record.dto';

@Controller('propertyRecords')
export class PropertyRecordController {
  constructor(private readonly propertyRecordService: PropertyRecordService) {}

  @Post()
  createPropertyRecord(@Body() dto: BasisPropertyRecordDto) {
    return this.propertyRecordService.create(dto);
  }

  @Get()
  findAllPropertyRecords(
    @Query('contactId') contactId?: string,
    @Query('propertyId') propertyId?: string,
  ) {
    if (contactId) {
      return this.propertyRecordService.findAllByContactId(contactId);
    } else if (propertyId) {
      return this.propertyRecordService.findAllByPropertyId(propertyId);
    } else {
      return this.propertyRecordService.findAll();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyRecordService.findOne(id);
  }

  @Put(':id')
  updateContact(@Param('id') id: string, @Body() dto: PropertyRecordDto) {
    return this.propertyRecordService.update(id, dto);
  }

  @Delete(':id')
  removeContact(@Param('id') id: string) {
    return this.propertyRecordService.remove(id);
  }
}
