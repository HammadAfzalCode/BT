const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "InterimInvoice",
    tableName: "interim_invoice",
    columns: {
        id: {
            type: "uuid",
            unique: true,
            primary: true,
            nullable: false,
            default: () => 'uuid_generate_v4()'
        },
        order_id: {
            type: "uuid",
        },
        total_bill: {
            type: "money",
            default: 0.0,
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
        order: {
            target: "Order",
            type: "many-to-one",
            joinColumn: { name: "order_id" },
        },
    },
});

