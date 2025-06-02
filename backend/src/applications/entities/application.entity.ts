import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  position: string;

  @Column()
  company: string;

  @Column({ default: 'Received' })
  status: string;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column({ nullable: true })
  resumePath: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'jsonb', nullable: true })
  skills: string[];

  @Column({ type: 'jsonb', nullable: true })
  timeline: { date: string; status: string }[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  appliedDate: Date;
}
