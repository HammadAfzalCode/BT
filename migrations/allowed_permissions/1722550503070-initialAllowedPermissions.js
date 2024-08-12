const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialAllowedPermissions1722550503070 {

    async up(queryRunner) {

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS allowed_permission (
                id UUID PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
                role_id UUID NOT NULL,
                permission_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT now() NOT NULL,
                updated_at TIMESTAMP DEFAULT now() NOT NULL,
                is_deleted BOOLEAN DEFAULT false NOT NULL,
                CONSTRAINT fk_role
                    FOREIGN KEY (role_id) REFERENCES roles(id),
                CONSTRAINT fk_permission
                    FOREIGN KEY (permission_id) REFERENCES permissions(id)
            )`)

        const roles = await queryRunner.query(`SELECT * FROM roles`);
        
        const permissions = await queryRunner.query(`SELECT * FROM permissions`);
        
        roles.forEach((role) => {
            permissions.forEach( async (permission) => {
                await queryRunner.query(
                    `INSERT INTO allowed_permission (role_id, permission_id) VALUES ($1, $2)`, 
                    [role.id, permission.id]
                );
            });
        })
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE allowed_permission`);
    }

}
