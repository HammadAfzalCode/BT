const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "ProductImage",
    tableName: "product_images",
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
            nullable: true,
        },
        image_url: {
            type: "varchar",
            nullable: true,
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
        product: {
            target: "Product",
            type: "many-to-one",
            joinColumn: { name: "product_id" },
            eager: true
        },
    },
});
