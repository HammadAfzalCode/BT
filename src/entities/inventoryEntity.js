const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Inventory",
    tableName: "inventory",
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
        warehouse_id: {
            type: "uuid",
        },
        product_id: {
            type: "uuid",
        },
        low_stock_threshold: {
            type: "int"
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
        warehouse: {
            target: "Warehouse",
            type: "many-to-one",
            joinColumn: { name: "warehouse_id" },
        },
        product: {
            target: "Product",
            type: "many-to-one",
            joinColumn: { name: "product_id" },
            eager: true
        },
    },
});
