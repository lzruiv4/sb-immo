import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyRecordEntity } from './property-record.entity';
import { PropertyRecordController } from './property-record.controller';
import { Module } from '@nestjs/common';
import { PropertyRecordService } from './property-record.service';
import { PropertyModule } from '../property/property.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyRecordEntity]),
    PropertyModule,
    ContactModule,
  ],
  controllers: [PropertyRecordController],
  providers: [PropertyRecordService],
})
export class PropertyRecordModule {}
