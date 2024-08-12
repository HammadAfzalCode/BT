const { createUserController, userLoginController, forgotPasswordController, verifyOtpController, updatePasswordController } = require("../../controllers/userController");
const { userAuthentication } = require('../../middlewares/authMiddleware')
const { createUserBody, loginUserBody, forgotPasswordBody, verifyOtpBody, updatePasswordBody } = require('../../schemas/userSchema');

module.exports = async (fastify, options) => {

	fastify.route({
		method: 'POST',
		url: '/create-user',
		schema: createUserBody,
		handler: createUserController,
	});

	fastify.route({
		method: "POST",
		url: "/login",
		schema: loginUserBody,
		handler: userLoginController,
	});

	fastify.route({
		method: 'POST',
		url: '/forgot-password',
		schema: forgotPasswordBody,
		handler: forgotPasswordController,
	})

	fastify.route({
		method: 'POST',
		url: '/verify-otp',
		schema: verifyOtpBody,
		handler: verifyOtpController,
	})

	fastify.route({
		method: "POST",
		url: "/update-password",
		schema: updatePasswordBody,
		preHandler: userAuthentication,
		handler: updatePasswordController,
	});
};
