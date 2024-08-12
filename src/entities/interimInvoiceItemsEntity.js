const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "InterimInvoiceItem",
    tableName: "interim_invoice_details",
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
        selling_price: {
            type: "money",
        },
        product_id: {
            type: "uuid",
        },
        interim_invoice_id: {
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
        interimInvoice: {
            target: "InterimInvoice",
            type: "many-to-one",
            joinColumn: { name: "interim_invoice_id" },
        },
        product: {
            target: "Product",
            type: "many-to-one",
            joinColumn: { name: "product_id" },
        },
    },
});
