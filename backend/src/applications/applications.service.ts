import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async create(
    createDto: CreateApplicationDto,
    file: Express.Multer.File,
  ): Promise<Application> {
    const application = new Application();
    application.name = createDto.name;
    application.email = createDto.email;
    application.position = createDto.position;
    application.company = createDto.company;

    // Handle optional fields with default values
    application.coverLetter = createDto.coverLetter || '';
    application.phone = createDto.phone || '';
    application.skills = createDto.skills || [];
    application.timeline = createDto.timeline || [];

    if (file) {
      const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Sanitize filename to prevent directory traversal
      const sanitizedFileName = file.originalname.replace(
        /[^a-zA-Z0-9._-]/g,
        '_',
      );
      const fileName = `${Date.now()}-${sanitizedFileName}`;
      const filePath = path.join(uploadDir, fileName);

      // Use async file writing
      const fileBuffer = await fs.promises.readFile(file.path);
      await fs.promises.writeFile(filePath, fileBuffer);
      application.resumePath = `/uploads/${fileName}`;
    }
    return this.applicationsRepository.save(application);
  }

  findAll(): Promise<Application[]> {
    return this.applicationsRepository.find();
  }

  async findOne(id: string): Promise<Application> {
    console.log('Finding application with ID:', id);
    const application = await this.applicationsRepository.findOneBy({ id });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return application;
  }

  async update(
    id: string,
    updateDto: UpdateApplicationDto,
  ): Promise<Application> {
    console.log('Updating application:', { id, updateDto });

    // First find the existing application
    const application = await this.findOne(id);
    console.log('Found existing application:', application);

    // If updating timeline, merge with existing timeline
    if (updateDto.timeline) {
      application.timeline = [
        ...(application.timeline || []),
        ...updateDto.timeline,
      ];
    }

    // Update other fields
    Object.assign(application, {
      ...updateDto,
      timeline: application.timeline, // Keep the merged timeline
    });

    console.log('Saving updated application:', application);
    const result = await this.applicationsRepository.save(application);
    console.log('Save result:', result);
    
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.applicationsRepository.delete(id);
  }
}
