import { Module } from '@nestjs/common';
import { KontakteController } from './contact.controller';
import { ContactEntity } from './contact.entity';
import { KontakteService } from './contact.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  controllers: [KontakteController],
  providers: [KontakteService],
})
export class KontakteModule {}
