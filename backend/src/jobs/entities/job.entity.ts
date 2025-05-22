import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  department: string;

  @Column()
  location: string;

  @Column()
  employmentType: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  postingDate: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate?: Date;

  @Column({ default: 0 })
  applications: number;

  @Column({ default: 'Active' })
  status: string;
}
