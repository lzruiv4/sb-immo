import { Module } from '@nestjs/common';
import { KontakteController } from './kontakte.controller';
import { KontakteEntity } from './kontakte.entity';
import { KontakteService } from './kontakte.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KontakteEntity])],
  controllers: [KontakteController],
  providers: [KontakteService],
})
export class KontakteModule {}
