const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Order",
    tableName: "orders",
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
        },
        warehouse_id: {
            type: "uuid",
            nullable: true,
        },
        store_id: {
            type: "uuid",
        },
        order_status: {
            type: "enum",
            enum: ["pending", "accepted", "picked", "packed", "in-transit", "canceled", "completed", "claimed"],
            default: "pending",
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
            type: "many-to-one",
            joinColumn: { name: "user_id" },
            eager: true
        },
        warehouse: {
            target: "Warehouse",
            type: "many-to-one",
            joinColumn: { name: "warehouse_id" },
            eager: true
        },
        store: {
            target: "Store",
            type: "many-to-one",
            joinColumn: { name: "store_id" },
            eager: true
        },
        orderDetails: {
            target: "OrderDetail",
            type: "one-to-many",
            inverseSide: "order",
        },
        claim: {
            target: "Claim",
            type: "one-to-many",
            inverseSide: "order",
        },
        interimInvoice: {
            target: "InterimInvoice",
            type: "one-to-many",
            inverseSide: "order",
        },
    },
});

