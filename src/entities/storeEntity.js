const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Store",
	tableName: "stores",
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
			nullable: true,
		},
		region: {
			type: "varchar",
			nullable: true,
		},
		location: {
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
	},
	relations: {
		orders: {
			target: "Order",
			type: "one-to-many",
			inverseSide: "store",
		},
		carts: {
			target: "Cart",
			type: "one-to-many",
			inverseSide: "store",
		},
	}
});
