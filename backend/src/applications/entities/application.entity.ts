import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column()
  jobId: string;

  @Column()
  position: string;

  @Column()
  company: string;

  @Column({ default: 'Received' })
  status: string;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column({ type: 'text', nullable: true })
  resumePath?: string | null;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  skills: string[];

  @Column({ type: 'jsonb', nullable: true, default: [] })
  timeline: { date: string; status: string }[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  appliedDate: Date;
}
