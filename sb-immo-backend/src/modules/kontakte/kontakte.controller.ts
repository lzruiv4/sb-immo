import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { KontakteService } from './kontakte.service';
import { CreateKontakteDto } from './dto/create.kontakte.dto';
import { UpdateKontakteDto } from './dto/update.kontakte.dto';

@Controller('kontakte')
export class KontakteController {
  constructor(private readonly kontakteService: KontakteService) {}

  @Post()
  createUser(@Body() dto: CreateKontakteDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateKontakteDto) {
    return this.kontakteService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kontakteService.remove(id);
  }
}
