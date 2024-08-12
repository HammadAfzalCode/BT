const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialRoles1722548720072 {

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id UUID PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
                name VARCHAR NOT NULL,
                created_at TIMESTAMP DEFAULT now() NOT NULL,
                updated_at TIMESTAMP DEFAULT now() NOT NULL,
                is_deleted BOOLEAN DEFAULT false NOT NULL
            )`);

        await queryRunner.query(`
            INSERT INTO roles (name) 
                VALUES 
                ('backoffice'),
                ('warehouse_manager'),
                ('store_manager'),
                ('warehouse_picker')
            `)
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE roles`);
    }

}
