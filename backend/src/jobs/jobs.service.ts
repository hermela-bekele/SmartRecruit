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
      applicationCount: 0,
      status: 'Active',
    });
    return this.jobsRepository.save(job);
  }

  async findAll(query?: any): Promise<Job[]> {
    const qb = this.jobsRepository.createQueryBuilder('job')
      .select([
        'job.id',
        'job.title',
        'job.department',
        'job.location',
        'job.company',
        'job.employmentType',
        'job.description',
        'job.postingDate',
        'job.expirationDate',
        'job.status',
        'job.applicationCount'
      ]);

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

  async findOne(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['applications'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, updateJobDto);
    return this.jobsRepository.save(job);
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOne(id);
    await this.jobsRepository.remove(job);
  }

  async closePosition(id: string): Promise<Job> {
    const job = await this.findOne(id);
    job.status = 'Closed';
    return this.jobsRepository.save(job);
  }

  async getJobApplications(id: string) {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['applications'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job.applications;
  }

  async incrementApplicationCount(id: string): Promise<void> {
    const job = await this.findOne(id);
    job.applicationCount = (job.applicationCount || 0) + 1;
    await this.jobsRepository.save(job);
  }

  async decrementApplicationCount(id: string): Promise<void> {
    const job = await this.findOne(id);
    job.applicationCount = Math.max(0, (job.applicationCount || 1) - 1);
    await this.jobsRepository.save(job);
  }
}
