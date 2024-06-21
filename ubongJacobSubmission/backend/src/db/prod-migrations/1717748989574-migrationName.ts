import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1717748989574 implements MigrationInterface {
    name = 'MigrationName1717748989574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` ADD \`totalSent\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` ADD \`currency\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` ADD \`dollarPrice\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` ADD \`dollarValue\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` ADD \`dollarSource\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` DROP COLUMN \`dollarSource\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` DROP COLUMN \`dollarValue\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` DROP COLUMN \`dollarPrice\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` DROP COLUMN \`totalSent\``);
    }

}
