import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1718008340306 implements MigrationInterface {
    name = 'MigrationName1718008340306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`leaderboard_tips\` (\`id\` varchar(255) NOT NULL, \`totalTip\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(255) NULL, UNIQUE INDEX \`REL_aa6b8f7a4fa1d8bce5f37f40c7\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`leaderboard_tips\` ADD CONSTRAINT \`FK_aa6b8f7a4fa1d8bce5f37f40c7c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`leaderboard_tips\` DROP FOREIGN KEY \`FK_aa6b8f7a4fa1d8bce5f37f40c7c\``);
        await queryRunner.query(`DROP INDEX \`REL_aa6b8f7a4fa1d8bce5f37f40c7\` ON \`leaderboard_tips\``);
        await queryRunner.query(`DROP TABLE \`leaderboard_tips\``);
    }

}
