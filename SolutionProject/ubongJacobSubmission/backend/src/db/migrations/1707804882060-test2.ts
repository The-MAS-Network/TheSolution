import { MigrationInterface, QueryRunner } from "typeorm";

export class Test21707804882060 implements MigrationInterface {
    name = 'Test21707804882060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageURL\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageURL\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageURL\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageURL\` mediumtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageURL\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageURL\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`imageURL\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`imageURL\` mediumtext NOT NULL`);
    }

}
