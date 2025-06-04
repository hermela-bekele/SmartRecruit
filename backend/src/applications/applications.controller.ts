import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('resume'))
  create(
    @Body() createDto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Application> {
    return this.applicationsService.create(createDto, file);
  }

  @Get()
  findAll(): Promise<Application[]> {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Application> {
    return this.applicationsService.findOne(id);
  }

  @Get(':id/resume')
  async downloadResume(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      console.log('Download resume request received for application:', id);

      const application = await this.applicationsService.findOne(id);
      console.log('Application found:', {
        id: application.id,
        resumePath: application.resumePath,
      });

      if (!application.resumePath) {
        throw new Error('No resume found for this application');
      }

      const fileName = application.resumePath.split('/').pop();
      if (!fileName) {
        throw new Error('Invalid resume path');
      }

      // Ensure we have the correct path to the uploads directory
      const uploadsDir = join(__dirname, '..', '..', 'uploads');
      const filePath = join(uploadsDir, fileName);

      console.log('Attempting to read file:', {
        fileName,
        filePath,
        exists: fs.existsSync(filePath),
      });

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`Resume file not found at path: ${filePath}`);
      }

      const file = createReadStream(filePath);
      const mimeType = this.getMimeType(fileName);

      console.log('Sending file response:', {
        fileName,
        mimeType,
        filePath,
      });

      res.set({
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      });

      return new StreamableFile(file);
    } catch (error) {
      console.error('Error in downloadResume:', {
        error: error.message,
        stack: error.stack,
        id,
      });
      throw error;
    }
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
      rtf: 'application/rtf',
    };
    return (
      mimeTypes[ext as keyof typeof mimeTypes] || 'application/octet-stream'
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.update(id, updateDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: string;
      emailContent?: string;
      emailSubject?: string;
    },
  ): Promise<Application> {
    return this.applicationsService.updateStatus(
      id,
      body.status,
      body.emailContent,
      body.emailSubject,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.applicationsService.remove(id);
  }
}
