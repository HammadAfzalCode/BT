const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Warehouse",
	tableName: "warehouses",
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
			inverseSide: "warehouse",
		},
		inventories: {
			target: "Inventory",
			type: "one-to-many",
			inverseSide: "warehouse",
		},
        batches: {
            target: "Batches",
            type: "one-to-many",
            inverseSide: "warehouse",
        },
	},
});
