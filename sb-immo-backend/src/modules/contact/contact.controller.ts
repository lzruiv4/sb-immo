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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  createContact(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @Get()
  findAllContacts() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Put(':id')
  updateContact(@Param('id') id: string, @Body() dto: ContactDto) {
    return this.contactService.update(id, dto);
  }

  @Delete(':id')
  removeContact(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
