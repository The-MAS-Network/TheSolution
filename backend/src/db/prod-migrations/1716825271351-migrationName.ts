import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1716825271351 implements MigrationInterface {
    name = 'MigrationName1716825271351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ordinal_tips_groups\` (\`id\` varchar(255) NOT NULL, \`totalTip\` int NOT NULL, \`type\` enum ('group_tip', 'single_tip') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`singleTipId\` varchar(255) NULL, \`ordinalCollectionNumericId\` int NULL, UNIQUE INDEX \`REL_bd2b2568af5ad6878917be9136\` (\`singleTipId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ordinal_tips\` (\`id\` varchar(255) NOT NULL, \`paymentId\` varchar(150) NOT NULL, \`pullPaymentId\` varchar(150) NULL, \`storeId\` varchar(150) NOT NULL, \`lightningAddress\` varchar(255) NOT NULL, \`cryptoCode\` varchar(50) NOT NULL, \`status\` enum ('pending', 'failed', 'success') NOT NULL, \`imageURL\` mediumtext NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ordinalTipGroupId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`admin_otps\` CHANGE \`purpose\` \`purpose\` enum ('FORGOT_PASSWORD', 'ON_BOARDING', 'Tip user', 'Tip collection') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` ADD CONSTRAINT \`FK_bd2b2568af5ad6878917be91364\` FOREIGN KEY (\`singleTipId\`) REFERENCES \`ordinal_tips\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` ADD CONSTRAINT \`FK_4a6f31dfd2d48ea92fc75d80070\` FOREIGN KEY (\`ordinalCollectionNumericId\`) REFERENCES \`ordinal_collections\`(\`numericId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD CONSTRAINT \`FK_fce9c1e51cc67f4a95c644e6ac6\` FOREIGN KEY (\`ordinalTipGroupId\`) REFERENCES \`ordinal_tips_groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP FOREIGN KEY \`FK_fce9c1e51cc67f4a95c644e6ac6\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` DROP FOREIGN KEY \`FK_4a6f31dfd2d48ea92fc75d80070\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips_groups\` DROP FOREIGN KEY \`FK_bd2b2568af5ad6878917be91364\``);
        await queryRunner.query(`ALTER TABLE \`admin_otps\` CHANGE \`purpose\` \`purpose\` enum ('FORGOT_PASSWORD', 'ON_BOARDING') NOT NULL`);
        await queryRunner.query(`DROP TABLE \`ordinal_tips\``);
        await queryRunner.query(`DROP INDEX \`REL_bd2b2568af5ad6878917be9136\` ON \`ordinal_tips_groups\``);
        await queryRunner.query(`DROP TABLE \`ordinal_tips_groups\``);
    }

}
