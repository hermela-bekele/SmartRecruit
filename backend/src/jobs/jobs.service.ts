// src/jobs/jobs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create({
      ...createJobDto,
      applications: 0,
      status: 'Active',
    });
    return this.jobsRepository.save(job);
  }

  async findAll(query?: any): Promise<Job[]> {
    const qb = this.jobsRepository.createQueryBuilder('job');

    if (query?.department) {
      qb.andWhere('job.department = :department', {
        department: query.department,
      });
    }

    if (query?.status) {
      qb.andWhere('job.status = :status', { status: query.status });
    }

    if (query?.location) {
      qb.andWhere('job.location = :location', { location: query.location });
    }

    if (query?.postedWithin) {
      const days = parseInt(query.postedWithin, 10);
      qb.andWhere('job.postingDate >= :date', {
        date: new Date(new Date().setDate(new Date().getDate() - days)),
      });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobsRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    return this.jobsRepository.save({ ...job, ...updateJobDto });
  }

  async remove(id: number): Promise<void> {
    const result = await this.jobsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  async closePosition(id: number): Promise<Job> {
    const job = await this.findOne(id);
    job.status = 'Closed';
    return this.jobsRepository.save(job);
  }
}
