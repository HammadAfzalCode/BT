const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Batches",
    tableName: "batches",
    columns: {
        id: {
            type: "uuid",
            unique: true,
            primary: true,
            nullable: false,
            default: () => 'uuid_generate_v4()'
        },
        batch_number: {
            type: "int",
            nullable: false,
        },
        product_id: {
            type: "uuid",
            nullable: false,
        },
        warehouse_id: {
            type: "uuid",
            nullable: false,
        },
        quantity: {
            type: "int",
            nullable: false,
        },
        expiry_date:{
            type: "date"
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
		product: {
			target: "Product",
			type: "many-to-one",
			joinColumn: { name: "product_id" },
		},
        warehouse: {
            target: "Warehouse",
            type: "many-to-one",
            joinColumn: { name: "warehouse_id" },
        },
    },
});
