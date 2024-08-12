const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Permission",
	tableName: "permissions",
	columns: {
		id: {
			type: "uuid",
			unique: true,
            primary: true,
			nullable: false,
            default: () => 'uuid_generate_v4()'
		},
		name: {
			type: "varchar",
			unique: true,
		},
		created_at: {
			type: "timestamp",
			default: () => "CURRENT_TIMESTAMP",
		},
		updated_at: {
			type: "timestamp",
			default: () => "CURRENT_TIMESTAMP",
		},
		is_deleted: {
			type: "boolean",
			default: false,
		},
	},
	relations: {
		allowedPermissions: {
			target: "AllowedPermission",
			type: "one-to-many",
			inverseSide: "permission",
		},
	},
});
