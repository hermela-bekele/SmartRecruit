import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DashboardStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalApplications: number;

  @Column()
  totalInterviews: number;

  @Column()
  totalOffers: number;

  @Column()
  totalRejected: number;

  @Column()
  avgTimeToHire: number;

  @Column()
  costPerHire: number;

  @Column()
  offerAcceptanceRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
