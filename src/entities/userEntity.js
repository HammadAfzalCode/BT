const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "User",
	tableName: "users",
	columns: {
		id: {
			type: "uuid",
			unique: true,
            primary: true,
			nullable: false,
            default: () => 'uuid_generate_v4()'
		},
		first_name: {
			type: "varchar",
			nullable: true,
		},
		last_name: {
			type: "varchar",
			nullable: true,
		},
		email: {
			type: "varchar",
			nullable: true,
		},
		password: {
			type: "varchar",
			nullable: true,
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
		role_id: {
			type: "uuid",
		},
		workplace_id: {
			type: "uuid",
			nullable: true
		},
	},
	relations: {
		role: {
			target: "Role",
			type: "many-to-one",
			joinColumn: { name: "role_id" },
			eager: true
		},
		workplace: {
			target: "Workplace",
			type: "many-to-one",
			joinColumn: { name: "workplace_id" },
			eager: true
		},
		orders: {
			target: "Order",
			type: "one-to-many",
			inverseSide: "user",
		},
		carts: {
			target: "Cart",
			type: "one-to-one",
			inverseSide: "user",
		},
		claims: {
			target: "Claim",
			type: "one-to-many",
			inverseSide: "user",
		},
	},
});
