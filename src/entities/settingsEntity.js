const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Setting",
	tableName: "settings",
	columns: {
		id: {
			type: "uuid",
			unique: true,
            primary: true,
			nullable: false,
            default: () => 'uuid_generate_v4()'
		},
		field_name: {
			type: "varchar",
			nullable: false,
		},
		field_value: {
			type: "varchar",
			nullable: false,
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
});
