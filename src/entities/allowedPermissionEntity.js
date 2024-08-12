const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "AllowedPermission",
	tableName: "allowed_permission",
	columns: {
		id: {
			type: "uuid",
			unique: true,
			primary: true,
			nullable: false,
			default: () => 'uuid_generate_v4()'
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
		role: {
			target: "Role",
			type: "many-to-one",
			joinColumn: { name: "role_id" },
			eager: true
		},
		permission: {
			target: "Permission",
			type: "many-to-one",
			joinColumn: { name: "permission_id" },
			eager: true
		},
	},
});
