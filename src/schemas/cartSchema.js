const addToCartSchema = {
    body: {
        type: "object",
        properties: {
            product_id: { type: "string" },
            quantity: { type: "number" },
        },
        required: ["product_id", "quantity"],
    },
    headers: {
        type: "object",
        properties: {
            authorization: { type: "string" }
        },
        required: ["authorization"]
    }
}

const getMyCartSchema = {
    headers: {
        type: "object",
        properties: {
            authorization: { type: "string" }
        },
        required: ["authorization"]
    }
}

module.exports = {
    addToCartSchema,
    getMyCartSchema,
}
