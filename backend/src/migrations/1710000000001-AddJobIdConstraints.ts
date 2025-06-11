import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJobIdConstraints1710000000001 implements MigrationInterface {
  name = 'AddJobIdConstraints1710000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make jobId not nullable
    await queryRunner.query(`
            ALTER TABLE "application" 
            ALTER COLUMN "jobId" SET NOT NULL;
        `);

    // Add foreign key constraint
    await queryRunner.query(`
            ALTER TABLE "application" 
            ADD CONSTRAINT "FK_application_job" 
            FOREIGN KEY ("jobId") 
            REFERENCES "job"("id") 
            ON DELETE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraint
    await queryRunner.query(`
            ALTER TABLE "application" 
            DROP CONSTRAINT IF EXISTS "FK_application_job";
        `);

    // Make jobId nullable
    await queryRunner.query(`
            ALTER TABLE "application" 
            ALTER COLUMN "jobId" DROP NOT NULL;
        `);
  }
}
