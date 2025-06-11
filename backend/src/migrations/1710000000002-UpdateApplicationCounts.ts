import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateApplicationCounts1710000000002
  implements MigrationInterface
{
  name = 'UpdateApplicationCounts1710000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update application counts for all jobs
    await queryRunner.query(`
            UPDATE "job"
            SET "applicationCount" = (
                SELECT COUNT(*)
                FROM "application"
                WHERE "application"."jobId" = "job"."id"
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reset all application counts to 0
    await queryRunner.query(`
            UPDATE "job"
            SET "applicationCount" = 0;
        `);
  }
}
