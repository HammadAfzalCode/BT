const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "OrderStatusLogsEntity",
	tableName: "order_status_logs",
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
		order_status: {
            type: "enum",
            enum: ["pending", "accepted", "picked", "packed", "in-transit", "canceled", "completed", "claimed"],
            default: "pending",
		},
		updated_by: {
			type: "uuid",
		},
		created_at: {
			type: "timestamp",
			default: () => "CURRENT_TIMESTAMP",
		},
	},
});
