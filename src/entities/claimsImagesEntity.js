const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "ClaimImage",
    tableName: "claim_images",
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
        claim_id: {
            type: "uuid",
            nullable: true,
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
        claim: {
            target: "Claim",
            type: "many-to-one",
            joinColumn: { name: "claim_id" },
            eager: true
        },
    },
});
