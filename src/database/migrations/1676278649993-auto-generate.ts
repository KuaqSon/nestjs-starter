import { MigrationInterface, QueryRunner } from 'typeorm';

export class autoGenerate1676278649993 implements MigrationInterface {
  name = 'autoGenerate1676278649993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(1024) NOT NULL, "content" text, "publishAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying NOT NULL, "roles" text array NOT NULL DEFAULT '{USER}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT false, "isConfirm" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."notification_channel_type_enum" AS ENUM('SLACK', 'TELEGRAM')`);
    await queryRunner.query(
      `CREATE TABLE "notification_channel" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."notification_channel_type_enum" NOT NULL DEFAULT 'SLACK', "isActive" boolean NOT NULL DEFAULT true, "metadata" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_50b36f3daa5dd86f7e707740b23" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
    await queryRunner.query(`DROP TABLE "notification_channel"`);
    await queryRunner.query(`DROP TYPE "public"."notification_channel_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
