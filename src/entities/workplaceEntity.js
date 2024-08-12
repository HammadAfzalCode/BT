const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Workplace",
    tableName: "workplace",
    columns: {
        id: {
            type: "uuid",
            unique: true,
            primary: true,
            nullable: false,
            default: () => 'uuid_generate_v4()'
        },
        workplace_type: {
            type: "varchar",
            nullable: true,
        },
        workplace_id: {
            type: "uuid",
            nullable: false,
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
});
