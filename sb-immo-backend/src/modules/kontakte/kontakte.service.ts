import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KontakteEntity } from './kontakte.entity';
import { CreateKontakteDto } from './dto/create.kontakte.dto';
import { UpdateKontakteDto } from './dto/update.kontakte.dto';

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

  async findOne(kontakteId: string): Promise<KontakteEntity> {
    const kontakteEntity = await this.kontakteRepository.findOne({
      where: { kontakteId },
    });
    if (!kontakteEntity)
      throw new NotFoundException('Kontakte ist nicht gefunden');
    return kontakteEntity;
  }

  async update(id: string, dto: UpdateKontakteDto): Promise<KontakteEntity> {
    await this.kontakteRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.kontakteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Kontakte ist nicht gefunden');
    }
    console.log(`Kontakte mit dem id ${id} ist gelöst.`);
  }
}
