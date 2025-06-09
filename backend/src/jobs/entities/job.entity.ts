import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  department: string;

  @Column()
  location: string;

  @Column({ nullable: false })
  company: string;

  @Column()
  employmentType: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  postingDate: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate?: Date;

  @Column({ default: 'Active' })
  status: string;

  @OneToMany(() => Application, application => application.job)
  applications: Application[];

  @Column({ default: 0 })
  applicationCount: number;
}
