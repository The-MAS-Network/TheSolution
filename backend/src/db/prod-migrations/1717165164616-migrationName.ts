import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1717165164616 implements MigrationInterface {
    name = 'MigrationName1717165164616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ordinals\` DROP FOREIGN KEY \`FK_293d99d4e2cbd314f6fb4378e4e\``);
        await queryRunner.query(`CREATE TABLE \`ordinal_collections_ordinals_ordinals\` (\`ordinalCollectionsNumericId\` int NOT NULL, \`ordinalsId\` varchar(255) NOT NULL, INDEX \`IDX_e2408d1983561f3a3f0ff072bf\` (\`ordinalCollectionsNumericId\`), INDEX \`IDX_6e356100926b048adf4811d225\` (\`ordinalsId\`), PRIMARY KEY (\`ordinalCollectionsNumericId\`, \`ordinalsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`storeId\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`storeTransactionId\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`checkoutLink\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`paymentHash\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`lightningAddress\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP COLUMN \`paymentId\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP COLUMN \`pullPaymentId\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP COLUMN \`storeId\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP COLUMN \`cryptoCode\``);
        await queryRunner.query(`ALTER TABLE \`ordinals\` DROP COLUMN \`ordinalCollectionNumericId\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`transactionId\` varchar(130) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD \`transactionId\` varchar(130) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD \`amount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD \`currency\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD \`error\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinals\` ADD \`userId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`amount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`destination\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`destination\` varchar(600) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`currency\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinals\` ADD UNIQUE INDEX \`IDX_44ade8c38090fbc3c305357cb5\` (\`ordinalId\`)`);
        await queryRunner.query(`ALTER TABLE \`ordinals\` ADD CONSTRAINT \`FK_4c35e4647babf2350d2089bee35\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ordinal_collections_ordinals_ordinals\` ADD CONSTRAINT \`FK_e2408d1983561f3a3f0ff072bfa\` FOREIGN KEY (\`ordinalCollectionsNumericId\`) REFERENCES \`ordinal_collections\`(\`numericId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ordinal_collections_ordinals_ordinals\` ADD CONSTRAINT \`FK_6e356100926b048adf4811d2259\` FOREIGN KEY (\`ordinalsId\`) REFERENCES \`ordinals\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ordinal_collections_ordinals_ordinals\` DROP FOREIGN KEY \`FK_6e356100926b048adf4811d2259\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_collections_ordinals_ordinals\` DROP FOREIGN KEY \`FK_e2408d1983561f3a3f0ff072bfa\``);
        await queryRunner.query(`ALTER TABLE \`ordinals\` DROP FOREIGN KEY \`FK_4c35e4647babf2350d2089bee35\``);
        await queryRunner.query(`ALTER TABLE \`ordinals\` DROP INDEX \`IDX_44ade8c38090fbc3c305357cb5\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`currency\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`destination\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`destination\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`amount\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinals\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP COLUMN \`error\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP COLUMN \`currency\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` DROP COLUMN \`transactionId\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP COLUMN \`transactionId\``);
        await queryRunner.query(`ALTER TABLE \`ordinals\` ADD \`ordinalCollectionNumericId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD \`cryptoCode\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD \`storeId\` varchar(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD \`pullPaymentId\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`ordinal_tips\` ADD \`paymentId\` varchar(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`lightningAddress\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`paymentHash\` mediumtext NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`checkoutLink\` mediumtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`storeTransactionId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD \`storeId\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_6e356100926b048adf4811d225\` ON \`ordinal_collections_ordinals_ordinals\``);
        await queryRunner.query(`DROP INDEX \`IDX_e2408d1983561f3a3f0ff072bf\` ON \`ordinal_collections_ordinals_ordinals\``);
        await queryRunner.query(`DROP TABLE \`ordinal_collections_ordinals_ordinals\``);
        await queryRunner.query(`ALTER TABLE \`ordinals\` ADD CONSTRAINT \`FK_293d99d4e2cbd314f6fb4378e4e\` FOREIGN KEY (\`ordinalCollectionNumericId\`) REFERENCES \`ordinal_collections\`(\`numericId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
