const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "OrderDetail",
    tableName: "order_details",
    columns: {
        id: {
            type: "uuid",
            unique: true,
            primary: true,
            nullable: false,
            default: () => 'uuid_generate_v4()'
        },
        ordered_quantity: {
            type: "int",
            nullable: true,
        },
        shipped_quantity: {
            type: "int",
            nullable: true,
        },
        recieved_quantity: {
            type: "int",
            nullable: true,
        },
        order_id: {
            type: "uuid",
        },
        product_id: {
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
        order: {
            target: "Order",
            type: "many-to-one",
            joinColumn: { name: "order_id" },
            eager: true
        },
        product: {
            target: "Product",
            type: "many-to-one",
            joinColumn: { name: "product_id" },
            eager: true
        },
    },
});
