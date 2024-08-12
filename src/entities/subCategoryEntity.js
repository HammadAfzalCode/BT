const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "SubCategory",
	tableName: "sub_categories",
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
		category_id: {
			type: "uuid",
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
		category: {
			target: "Category",
			type: "many-to-one",
			joinColumn: { name: "category_id" },
			eager: true
		},
		products: {
			target: "Product",
			type: "one-to-many",
			inverseSide: "subCategory",
		},
	},
});
