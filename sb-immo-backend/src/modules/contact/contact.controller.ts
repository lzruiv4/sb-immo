import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactDto } from './dto/contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  createUser(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @Get()
  findAllUsers() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() dto: ContactDto) {
    return this.contactService.update(id, dto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
