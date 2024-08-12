const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "UserAuditEntity",
	tableName: "user_audit",
	columns: {
		id: {
			type: "uuid",
			unique: true,
            primary: true,
			nullable: false,
            default: () => 'uuid_generate_v4()'
		},
		user_id: {
			type: "uuid",
		},
		activity: {
			type: "varchar",
			nullable: true,
		},
		activity_description: {
			type: "varchar",
			nullable: true,
		},
		created_at: {
			type: "timestamp",
			default: () => "CURRENT_TIMESTAMP",
		},
	},
});
