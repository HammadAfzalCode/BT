const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Product",
    tableName: "products",
    columns: {
        id: {
            type: "uuid",
            unique: true,
            primary: true,
            nullable: false,
            default: () => 'uuid_generate_v4()'
        },
        title: {
            type: "varchar",
            nullable: false,
        },
        description: {
            type: "text",
            nullable: true,
        },
        thumbnail_image_url: {
            type: "varchar",
            nullable: true,
        },
        box_barcode: {
            type: "varchar",
            unique: true,
            nullable: true,
        },
        unit_barcode: {
            type: "varchar",
            nullable: true
        },
        pack_of: {
            type: "int",
            nullable: true
        },
        unit_price: {
            type: "money",
        },
        selling_price: {
            type: "money",
        },
        category_id: {
            type: "uuid",
        },
        sub_category_id: {
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
        subCategory: {
            target: "SubCategory",
            type: "many-to-one",
            joinColumn: { name: "sub_category_id" },
            eager: true
        },
        orderDetails: {
            target: "OrderDetail",
            type: "one-to-many",
            inverseSide: "product",
        },
        cartItems: {
            target: "CartItems",
            type: "one-to-many",
            inverseSide: "product",
        },
        productImages: {
            target: "ProductImage",
            type: "one-to-many",
            inverseSide: "product",
        },
        batches: {
            target: "Batches",
            type: "one-to-many",
            inverseSide: "product",
        },
        inventory: {
            target: "Inventory",
            type: "one-to-many",
            inverseSide: "product",
        },
        claim: {
            target: "Claim",
            type: "one-to-many",
            inverseSide: "product",
        },
        interimInvoice: {
            target: "InterimInvoice",
            type: "one-to-many",
            inverseSide: "product",
        },
    },
});
