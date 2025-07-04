import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule as ContactModule } from './modules/contact/contact.module';
import { ContactEntity } from './modules/contact/contact.entity';
import { AddressEntity } from './modules/address/address.entity';
import { AddressModule } from './modules/address/address.module';
import { PropertyEntity } from './modules/property/property.entity';
import { PropertyModule } from './modules/property/property.module';
import { PropertyRecordModule } from './modules/property-record/property-record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get('NODE_ENV') !== 'production';
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [ContactEntity, AddressEntity, PropertyEntity],
          synchronize: true,
          logging: isDev,
          autoLoadEntities: true,
        };
      },
    }),
    ContactModule,
    AddressModule,
    PropertyModule,
    PropertyRecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
