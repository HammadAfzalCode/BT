const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Cart",
	tableName: "carts",
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
			nullable: false,
		},
		store_id: {
			type: "uuid",
			nullable: false,
		},
        discount_percentage: {
            type: "int",
            default: 0,
        },
        shipping_cost: {
            type: "money",
            default: 0.0,
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
		user: {
			target: "User",
			type: "one-to-one",
			joinColumn: { name: "user_id" },
		},
		store: {
			target: "Store",
			type: "many-to-one",
			joinColumn: { name: "store_id" },
		},
		cartItems: {
			target: "CartItems",
			type: "one-to-many",
			inverseSide: "cart",
		},
	},
});
