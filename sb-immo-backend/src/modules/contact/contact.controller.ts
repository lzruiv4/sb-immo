import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { KontakteService } from './contact.service';
import { CreateContactDto } from './dto/create.contact.dto';
import { UpdateContactDto } from './dto/update.contact.dto';

@Controller('contacts')
export class KontakteController {
  constructor(private readonly kontakteService: KontakteService) {}

  @Post()
  createUser(@Body() dto: CreateContactDto) {
    return this.kontakteService.create(dto);
  }

  @Get()
  testConnection() {
    return this.kontakteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kontakteService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.kontakteService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kontakteService.remove(id);
  }
}
