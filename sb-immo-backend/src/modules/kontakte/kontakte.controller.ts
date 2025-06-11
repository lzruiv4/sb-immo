import { Body, Controller, Get, Post } from '@nestjs/common';
import { KontakteService } from './kontakte.service';
import { CreateKontakteDto } from './dto/kontakte.dto';

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
}
