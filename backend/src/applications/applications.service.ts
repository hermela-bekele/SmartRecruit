import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import * as fs from 'fs';
import * as path from 'path';
import { MailService } from '../mail/mail.service';
import { JobsService } from '../jobs/jobs.service';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    private mailService: MailService,
    private jobsService: JobsService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    file?: Express.Multer.File,
  ): Promise<Application> {
    try {
      console.log('Creating application with file:', {
        fileExists: !!file,
        fileDetails: file
          ? {
              originalname: file.originalname,
              filename: file.filename,
              mimetype: file.mimetype,
              size: file.size,
            }
          : null,
      });

      // Get the job using the jobId from the DTO
      const job = await this.jobsService.findOne(createApplicationDto.jobId);

      // Handle file path if file was uploaded
      let resumePath: string | null = null;
      if (file && file.filename) {
        const filePath = join(process.cwd(), 'uploads', file.filename);
        if (existsSync(filePath)) {
          resumePath = file.filename;
          console.log('File saved successfully:', {
            filename: file.filename,
            path: filePath,
          });
        } else {
          console.error('File not found after upload:', filePath);
          throw new Error('Failed to save resume file');
        }
      }

      // Create the application entity
      const application = new Application();
      application.name = createApplicationDto.name;
      application.email = createApplicationDto.email;
      application.position = createApplicationDto.position;
      application.company = createApplicationDto.company;
      application.phone = createApplicationDto.phone;
      application.skills = createApplicationDto.skills || [];
      application.coverLetter = createApplicationDto.coverLetter;
      application.resumePath = resumePath;
      application.job = job;
      application.jobId = job.id;
      application.status = 'Received';
      application.timeline = [
        { date: new Date().toISOString(), status: 'Received' },
      ];

      console.log('Saving application with data:', {
        name: application.name,
        email: application.email,
        position: application.position,
        resumePath: application.resumePath,
        jobId: application.jobId,
      });

      // Save the application
      const savedApplication =
        await this.applicationsRepository.save(application);
      await this.jobsService.incrementApplicationCount(job.id);

      console.log('Application saved successfully:', {
        id: savedApplication.id,
        resumePath: savedApplication.resumePath,
      });

      return savedApplication;
    } catch (error) {
      console.error('Error creating application:', {
        error: error.message,
        stack: error.stack,
      });

      // If there was an error and a file was uploaded, try to delete it
      if (file && file.filename) {
        try {
          const filePath = join(process.cwd(), 'uploads', file.filename);
          if (existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Cleaned up file after error:', filePath);
          }
        } catch (deleteError) {
          console.error(
            'Error deleting file after failed application:',
            deleteError,
          );
        }
      }

      throw error;
    }
  }

  async findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({
      relations: ['job'],
    });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['job'],
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    const application = await this.findOne(id);

    if (
      updateApplicationDto.status &&
      updateApplicationDto.status !== application.status
    ) {
      application.timeline = [
        ...(application.timeline || []),
        { date: new Date().toISOString(), status: updateApplicationDto.status },
      ];
    }

    Object.assign(application, updateApplicationDto);
    return this.applicationsRepository.save(application);
  }

  async remove(id: string): Promise<void> {
    const application = await this.findOne(id);
    const jobId = application.job.id;

    await this.applicationsRepository.remove(application);
    await this.jobsService.decrementApplicationCount(jobId);
  }

  async findByJob(jobId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { jobId },
      relations: ['job'],
    });
  }

  async updateStatus(
    id: string,
    status: string,
    emailContent?: string,
    emailSubject?: string,
  ): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    application.status = status;

    // Add the status change to the timeline
    if (!application.timeline) {
      application.timeline = [];
    }

    application.timeline.push({
      date: new Date().toISOString().split('T')[0],
      status: status,
    });

    const updatedApplication =
      await this.applicationsRepository.save(application);

    // Send email if content is provided
    if (emailContent && emailSubject) {
      try {
        await this.mailService.sendCandidateEmail(
          application.email,
          emailSubject,
          emailContent,
        );
      } catch (error) {
        console.error('Failed to send email:', error);
        // Don't throw the error as we still want to update the status
      }
    }

    return updatedApplication;
  }
}
