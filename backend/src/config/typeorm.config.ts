import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import * as path from 'path';

// Load environment variables
config();

const configService = new ConfigService();

// Get the project root directory (backend folder)
const projectRoot = path.resolve(__dirname, '..', '..');

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT') || '5432'),
  username: configService.get('DB_USERNAME') || 'postgres',
  password: configService.get('DB_PASSWORD') || 'postgres',
  database: configService.get('DB_DATABASE') || 'application-tracker',
  entities: [Job, Application],
  migrations: [path.join(projectRoot, 'dist', 'migrations', '*.js')],
  migrationsRun: true,
  synchronize: false,
  logging: true
};

// Log the configuration for debugging
console.log('Current directory:', __dirname);
console.log('Project root:', projectRoot);
console.log('Migrations path:', path.join(projectRoot, 'dist', 'migrations', '*.js'));

const dataSource = new DataSource(dataSourceOptions);
export default dataSource; 