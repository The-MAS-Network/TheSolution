import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1716222895525 implements MigrationInterface {
    name = 'MigrationName1716222895525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`btc_pay_server_payments\` (\`id\` varchar(255) NOT NULL, \`storeId\` varchar(255) NOT NULL, \`storeTransactionId\` varchar(255) NOT NULL, \`purpose\` enum ('forgot_password', 'verify_account') NOT NULL, \`amount\` varchar(255) NOT NULL, \`checkoutLink\` mediumtext NOT NULL, \`currency\` varchar(255) NOT NULL, \`destination\` mediumtext NULL, \`paymentHash\` mediumtext NULL, \`lightningAddress\` varchar(255) NULL, \`firstPayoutAmount\` int NULL, \`secondPayoutAmount\` int NULL, \`trialCount\` int NOT NULL DEFAULT '0', \`isVerified\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ordinal_wallets\` (\`id\` varchar(255) NOT NULL, \`onChainWallet\` varchar(255) NOT NULL, \`transactionId\` varchar(255) NULL, \`address\` varchar(255) NOT NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`isBroadcasted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(255) NULL, UNIQUE INDEX \`REL_6180c0aa5e1323266e553cb343\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(255) NOT NULL, \`nickName\` varchar(255) NOT NULL, \`lightningAddress\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`imageURL\` mediumtext NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_386e7131ac580feefb3029daca\` (\`lightningAddress\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ordinal_collections\` (\`numericId\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_d668055a0c09bc272ab3ebb2dd\` (\`id\`), PRIMARY KEY (\`numericId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ordinals\` (\`id\` varchar(255) NOT NULL, \`ordinalId\` varchar(150) NOT NULL, \`possibleOrdinalContent\` varchar(2000) NULL, \`mimeType\` varchar(255) NOT NULL, \`contentType\` varchar(255) NOT NULL, \`isAdmin\` tinyint NOT NULL DEFAULT 0, \`lightningAddress\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ordinalCollectionNumericId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admins\` (\`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`email\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin_otps\` (\`id\` varchar(255) NOT NULL, \`otp\` varchar(10) NOT NULL, \`email\` varchar(255) NOT NULL, \`purpose\` enum ('FORGOT_PASSWORD', 'ON_BOARDING') NOT NULL, \`isUsed\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` ADD CONSTRAINT \`FK_39e04bde7f3183fc21aafa1e603\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ordinal_wallets\` ADD CONSTRAINT \`FK_6180c0aa5e1323266e553cb343e\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ordinals\` ADD CONSTRAINT \`FK_293d99d4e2cbd314f6fb4378e4e\` FOREIGN KEY (\`ordinalCollectionNumericId\`) REFERENCES \`ordinal_collections\`(\`numericId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ordinals\` DROP FOREIGN KEY \`FK_293d99d4e2cbd314f6fb4378e4e\``);
        await queryRunner.query(`ALTER TABLE \`ordinal_wallets\` DROP FOREIGN KEY \`FK_6180c0aa5e1323266e553cb343e\``);
        await queryRunner.query(`ALTER TABLE \`btc_pay_server_payments\` DROP FOREIGN KEY \`FK_39e04bde7f3183fc21aafa1e603\``);
        await queryRunner.query(`DROP TABLE \`admin_otps\``);
        await queryRunner.query(`DROP TABLE \`admins\``);
        await queryRunner.query(`DROP TABLE \`ordinals\``);
        await queryRunner.query(`DROP INDEX \`IDX_d668055a0c09bc272ab3ebb2dd\` ON \`ordinal_collections\``);
        await queryRunner.query(`DROP TABLE \`ordinal_collections\``);
        await queryRunner.query(`DROP INDEX \`IDX_386e7131ac580feefb3029daca\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_6180c0aa5e1323266e553cb343\` ON \`ordinal_wallets\``);
        await queryRunner.query(`DROP TABLE \`ordinal_wallets\``);
        await queryRunner.query(`DROP TABLE \`btc_pay_server_payments\``);
    }

}
