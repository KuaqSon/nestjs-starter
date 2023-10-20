import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1697799170337 implements MigrationInterface {
  name = 'AutoGenerate1697799170337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Post" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(1024) NOT NULL, "content" text, "publishAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid, CONSTRAINT "PK_c4d3b3dcd73db0b0129ea829f9f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying NOT NULL, "roles" text array NOT NULL DEFAULT '{USER}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT false, "isConfirm" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."NotificationChannel_type_enum" AS ENUM('SLACK', 'TELEGRAM')`);
    await queryRunner.query(
      `CREATE TABLE "NotificationChannel" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."NotificationChannel_type_enum" NOT NULL DEFAULT 'SLACK', "isActive" boolean NOT NULL DEFAULT true, "metadata" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_931ec7da9f7624726408a4ea3c5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "Post" ADD CONSTRAINT "FK_97e81bcb59530bfb061e48aee6a" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Post" DROP CONSTRAINT "FK_97e81bcb59530bfb061e48aee6a"`);
    await queryRunner.query(`DROP TABLE "NotificationChannel"`);
    await queryRunner.query(`DROP TYPE "public"."NotificationChannel_type_enum"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TABLE "Post"`);
  }
}
