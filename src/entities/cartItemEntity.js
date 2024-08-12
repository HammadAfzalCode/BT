const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "CartItems",
	tableName: "cart_items",
	columns: {
		id: {
			type: "uuid",
			unique: true,
			primary: true,
			nullable: false,
            default: () => 'uuid_generate_v4()'
		},
		quantity: {
			type: "int",
			nullable: true,
		},
		cart_id: {
			type: "uuid",
			nullable: false,
		},
		product_id: {
			type: "uuid",
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
	relations: {
		cart: {
			target: "Cart",
			type: "many-to-one",
			joinColumn: { name: "cart_id" },
		},
		product: {
			target: "Product",
			type: "many-to-one",
			joinColumn: { name: "product_id" },
			eager: true
		},
	},
});
