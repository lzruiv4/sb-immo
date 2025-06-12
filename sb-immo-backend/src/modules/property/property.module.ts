import { Module } from '@nestjs/common';
import { PropertyEntity } from './property.entity';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './property.service';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyEntity]), AddressModule],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
