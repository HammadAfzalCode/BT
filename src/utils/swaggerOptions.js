const config = require("../globals/config");

const swaggerObject = {
	swagger: {
		info: {
			title: "API Documentation",
			description: "API documentation with Swagger",
			version: "1.0.0",
		},
		host: `${config.get("server").host}:${config.get("server").port}`,
		schemes: ["http", "https"],
		consumes: ["application/json"],
		produces: ["application/json"],
		securityDefinitions: {
			bearerAuth: {
				type: "apiKey",
				scheme: "Bearer",
				name: "Authorization",
				in: "header",
				description: "Enter your bearer token in the format **Bearer &lt;token&gt;**",
			},
		},
	},
};

const swaggerUIObject = {
	routePrefix: "/docs",
	uiConfig: {
		docExpansion: "full",
		deepLinking: false,
	},
	uiHooks: {
		onRequest: function (request, response, next) {
			next();
		},
		preHandler: function (request, response, next) {
			next();
		},
	},
	staticCSP: true,
	transformStaticCSP: (header) => header,
	transformSpecification: (swaggerObject, request, response) => {
		return swaggerObject;
	},
	transformSpecificationClone: true,
};

module.exports = {
	swaggerObject,
	swaggerUIObject,
};
