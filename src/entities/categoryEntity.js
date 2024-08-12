const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Category",
	tableName: "categories",
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
			nullable: false,
		},
		thumbnail_image: {
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
		products: {
			target: "Product",
			type: "one-to-many",
			inverseSide: "category",
		},
		subCategories: {
			target: "SubCategory",
			type: "one-to-many",
			inverseSide: "category",
		},
	},
});
