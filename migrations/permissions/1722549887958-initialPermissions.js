const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialPermissions1722549887958 {

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS permissions (
                id UUID PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
                name VARCHAR NOT NULL,
                created_at TIMESTAMP DEFAULT now() NOT NULL,
                updated_at TIMESTAMP DEFAULT now() NOT NULL,
                is_deleted BOOLEAN DEFAULT false NOT NULL
            )`);

        await queryRunner.query(`
            INSERT INTO permissions (name) 
                VALUES 
                ('view-categories'),
                ('create-categories'),
                ('update-categories'),
                ('delete-categories'),
                ('view-product'),
                ('create-product'),
                ('update-product'),
                ('delete-product'),
                ('view-order'),
                ('create-order'),
                ('update-order'),
                ('delete-order'),
                ('view-user'),
                ('create-user'),
                ('update-user'),
                ('delete-user'),
                ('view-claims'),
                ('create-claims'),
                ('update-claims'),
                ('delete-claims'),
                ('view-roles'),
                ('create-roles'),
                ('update-roles'),
                ('delete-roles'),
                ('view-permissions'),
                ('create-permissions'),
                ('update-permissions'),
                ('delete-permissions'),
                ('view-warehouses'),
                ('create-warehouses'),
                ('update-warehouses'),
                ('delete-warehouses'),
                ('view-stores'),
                ('create-stores'),
                ('update-stores'),
                ('delete-stores');
            `)
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE permissions`);
    }

}
