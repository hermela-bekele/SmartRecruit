import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardStats } from './dashboard.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DashboardStats)
    private dashboardStatsRepository: Repository<DashboardStats>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async getDashboardStats() {
    try {
      // Get all applications
      const applications = await this.applicationRepository.find();

      // Calculate statistics based on application status
      const totalApplications = applications.length;
      const totalUnderReview = applications.filter(
        (app) => app.status === 'Under Review',
      ).length;
      const totalInterviews = applications.filter(
        (app) => app.status === 'Interview',
      ).length;
      const totalOffers = applications.filter(
        (app) => app.status === 'Offer',
      ).length;
      const totalHired = applications.filter(
        (app) => app.status === 'Hired',
      ).length;
      const totalRejected = applications.filter(
        (app) => app.status === 'Rejected',
      ).length;

      // Calculate average time to hire (in days) using appliedDate
      const hiredApplications = applications.filter(
        (app) => app.status === 'Hired',
      );
      const avgTimeToHire =
        hiredApplications.length > 0
          ? hiredApplications.reduce((acc, app) => {
              const days = Math.ceil(
                (new Date().getTime() - new Date(app.appliedDate).getTime()) /
                  (1000 * 60 * 60 * 24),
              );
              return acc + days;
            }, 0) / hiredApplications.length
          : 0;

      // Calculate cost per hire (assuming $5000 per hire)
      const costPerHire = 5000;

      // Calculate offer acceptance rate
      const offerAcceptanceRate =
        totalOffers > 0 ? (totalHired / totalOffers) * 100 : 0;

      // Get open positions (limited to 5)
      const openPositions = await this.jobRepository.find({
        where: { status: 'Active' },
        relations: ['applications'],
        take: 5,
      });

      // Get application pipeline data
      const pipelineData = await this.applicationRepository
        .createQueryBuilder('application')
        .select('application.status', 'status')
        .addSelect('COUNT(application.id)', 'count')
        .groupBy('application.status')
        .getRawMany();

      return {
        stats: {
          totalApplications,
          totalUnderReview,
          totalInterviews,
          totalOffers,
          totalHired,
          totalRejected,
          avgTimeToHire: Math.round(avgTimeToHire),
          costPerHire,
          offerAcceptanceRate: Math.round(offerAcceptanceRate),
        },
        openPositions: openPositions.map((job) => ({
          title: job.title,
          department: job.department,
          count: job.applications.length,
          days: job.expirationDate
            ? Math.ceil(
                (new Date(job.expirationDate).getTime() -
                  new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              )
            : 30, // Default to 30 days if no expiration date is set
        })),
        pipelineData,
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }
}
