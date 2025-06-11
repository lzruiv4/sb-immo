import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KontakteEntity } from './kontakte.entity';
import { CreateKontakteDto } from './dto/kontakte.dto';

@Injectable()
export class KontakteService {
  constructor(
    @InjectRepository(KontakteEntity)
    private kontakteRepository: Repository<KontakteEntity>,
  ) {}

  async create(dto: CreateKontakteDto): Promise<KontakteEntity> {
    const newKontakteEntity = this.kontakteRepository.create(dto);
    console.log('Creating new KontakteEntity:', newKontakteEntity);
    newKontakteEntity.createdAt = new Date(); // Set createdAt to current date
    console.log('Setting createdAt to:', newKontakteEntity.createdAt);
    return this.kontakteRepository.save(newKontakteEntity);
  }

  async findAll(): Promise<KontakteEntity[]> {
    return this.kontakteRepository.find();
  }

  //   async findOne(id: string): Promise<User> {
  //     const user = await this.userRepo.findOne({ where: { id } });
  //     if (!user) throw new NotFoundException('User not found');
  //     return user;
  //   }

  //   async update(id: string, dto: UpdateUserDto): Promise<User> {
  //     await this.userRepo.update(id, dto);
  //     return this.findOne(id);
  //   }

  //   async remove(id: string): Promise<void> {
  //     const result = await this.userRepo.delete(id);
  //     if (result.affected === 0) {
  //       throw new NotFoundException('User not found');
  //     }
  //   }
}
