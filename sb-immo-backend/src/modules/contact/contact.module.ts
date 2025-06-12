import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactEntity } from './contact.entity';
import { ContactService } from './contact.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class KontakteModule {}
