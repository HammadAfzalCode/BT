const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Claim",
    tableName: "claims",
    columns: {
        id: {
            type: "uuid",
            unique: true,
            primary: true,
            nullable: false,
            default: () => 'uuid_generate_v4()'
        },
        claim_type: {
            type: "enum",
            enum: ["defected", "missing"],
        },
        order_id: {
            type: "uuid",
        },
        product_id: {
            type: "uuid",
        },
        message: {
            type: "text",
            nullable: true,
        },
        quantity: {
            type: "int",
            nullable: true,
        },
        claim_status: {
            type: "enum",
            enum: ["pending", "accepted", "picked", "packed", "in-transit", "resolved", "rejected"],
            default: "pending"
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
        product: {
            target: "Product",
            type: "many-to-one",
            joinColumn: { name: "product_id" },
        },
        claimImages: {
            target: "ClaimImage",
            type: "one-to-many",
            inverseSide: "claim",
        },
    },
});
