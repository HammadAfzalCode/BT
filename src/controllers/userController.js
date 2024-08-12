const Boom = require('@hapi/boom')
const { logger } = require("../../logger");
const { createUserService, userLoginService, forgotPasswordService, verifyOtpService, updatePasswordService } = require("../services/userService");

const createUserController = async (request, response) => {
	logger.info("userRoutes > createUserController")
	try {
		const { email, first_name, last_name, password, role, workplace_type, workplace_id } = request.body
		const userData = await createUserService(email, first_name, last_name, password, role, workplace_type, workplace_id);
		response.code(200).send({
			success: true,
			message: "User Created Successfully",
			data: userData
		});
	} catch (error) {
		response.code(400).send({
			success: false,
			message: error.message
		});
	}
};

const userLoginController = async (request, response) => {
	logger.info('userRoutes > userLoginController')
	try {
		const { email, password } = request.body
		const { user, token } = await userLoginService(email, password)
		response.code(200).send({
			success: true,
			message: "User Login Successfully",
			token: token,
			data: user
		});
	} catch (error) {
		response.code(401).send({
			success: false,
			message: error.message
		});
	}
}

const forgotPasswordController = async (request, response) => {
	logger.info('userRoutes > forgotPasswordController')
	try {
		const { email } = request.body
		const otpSendSuccess = await forgotPasswordService(email)
		response.code(otpSendSuccess ? 200 : 400).send({
			success: otpSendSuccess,
			message: otpSendSuccess ? "OTP send successfully." : "Oops! Something went wrong please try again."
		});
	} catch (error) {
		response.code(401).send({
			success: false,
			message: error.message
		});
	}

}

const verifyOtpController = async (request, response) => {
	logger.info('userRoutes > forgotPasswordController')
	try {
		const { email, otp } = request.body
		const token = await verifyOtpService(email, otp)
		response.code(200).send({
			success: true,
			message: "OTP Verified.",
			token: token
		});
	} catch (error) {
		response.code(401).send({
			success: false,
			message: error.message
		});
	}
}

const updatePasswordController = async (request, response) => {
	logger.info('userRoutes > updatePasswordController')
	try {
		if (!request.user) throw Boom.unauthorized('Unauthorized User')
		const { email } = request.user
		const { new_password } = request.body
		await updatePasswordService(email, new_password)
		response.code(200).send({
			success: true,
			message: "Password updated successfully.",
		});
	} catch (error) {
		response.code(401).send({
			success: false,
			message: error.message
		});
	}

}


module.exports = {
	createUserController,
	userLoginController,
	verifyOtpController,
	forgotPasswordController,
	updatePasswordController,
};
