import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJobIdToApplication1710000000000 implements MigrationInterface {
    name = 'AddJobIdToApplication1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, add the jobId column
        await queryRunner.query(`
            ALTER TABLE "application" ADD COLUMN IF NOT EXISTS "jobId" uuid;
        `);

        // Create a default job for applications without a matching job
        await queryRunner.query(`
            INSERT INTO "job" (
                id, 
                title, 
                department, 
                location, 
                company, 
                "employmentType", 
                description, 
                status, 
                "postingDate"
            )
            VALUES (
                uuid_generate_v4(),
                'Legacy Position',
                'Legacy Department',
                'Unknown',
                'Legacy Company',
                'Full-time',
                'Default position for applications without matching jobs',
                'Closed',
                NOW()
            )
            RETURNING id;
        `);

        // Update applications to link with existing jobs
        await queryRunner.query(`
            UPDATE "application" a
            SET "jobId" = (
                SELECT j.id FROM "job" j 
                WHERE j.title = a.position 
                LIMIT 1
            )
            WHERE "jobId" IS NULL;
        `);

        // Update remaining applications with the default job
        await queryRunner.query(`
            UPDATE "application" a
            SET "jobId" = (
                SELECT id FROM "job"
                WHERE description = 'Default position for applications without matching jobs'
                LIMIT 1
            )
            WHERE "jobId" IS NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove jobId column
        await queryRunner.query(`
            ALTER TABLE "application" DROP COLUMN IF EXISTS "jobId";
        `);

        // Remove the default job
        await queryRunner.query(`
            DELETE FROM "job"
            WHERE description = 'Default position for applications without matching jobs';
        `);
    }
} 