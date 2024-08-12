const _ = require('lodash');
const Boom = require('@hapi/boom')
const { client } = require('../../infrastructure/redis')
const { dataSource } = require("../../infrastructure/postgres");
const { signAccessToken, verifyAccessToken } = require('../helpers/jwtHelper');
const { sendOtpViaEmail } = require('../helpers/otpVerificationHelper');
const { randomFixedInteger } = require('../utils/randomValueGenerators');
const { createUser, getUser, updateUserPassword } = require('../repositories/userRepository');
const { createHashValue, compareHash } = require('../helpers/hashingHelper');
const { create } = require('../repositories/cartRepository');
const { getRole } = require('../repositories/rolesRepository');
const { getWorkplace, createWorkplace } = require('../repositories/workplaceRepo');
const { getStore } = require('../repositories/storeRepository');
const { getWarehouse } = require('../repositories/warehouseRepository');
const { getPermissionsArray } = require('../repositories/rolePermissionRepository')
const config = require("../globals/config");
const createUserService = async (email, first_name, last_name, password, role, workplace_type, workplace_id) => {

	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {

		const userExists = await getUser({ email })
		if (!_.isEmpty(userExists)) throw Boom.forbidden('User already exists');

		const checkWorkplaceEntity = {
			store: await getStore({ id: workplace_id }),
			warehouse: await getWarehouse({ id: workplace_id })
		}

		const workplaceExists = checkWorkplaceEntity[workplace_type]
		if (_.isNil(workplaceExists)) throw Boom.badData('The workplace does not exists');

		const userRole = await getRole({ name: role });
		if (_.isNil(userRole)) throw Boom.badData('This role does not exists');

		let workplace = await getWorkplace({ workplace_type, workplace_id })
		if (_.isNil(workplace)) workplace = await createWorkplace(workplace_type, workplace_id, { queryRunner: queryRunner })

		const hashedPassword = await createHashValue(password);

		const userData = await createUser({
			email: email,
			first_name: first_name,
			last_name: last_name,
			password: hashedPassword,
			role_id: userRole.id,
			workplace_id: workplace.id
		}, { queryRunner: queryRunner });

		const shipping_cost = config.get("constants").shipping_cost;
		if (workplace.workplace_type == 'store') await create({ user_id: userData.id, store_id: workplace.workplace_id, shipping_cost}, {queryRunner})

		await queryRunner.commitTransaction();

		return {
			greeting: `${userData.first_name} ${userData.last_name}'s account has been created`,
		};

	} catch (error) {
		await queryRunner.rollbackTransaction();
		throw error
	} finally {
		await queryRunner.release();
	}
};

const userLoginService = async (email, password) => {
	const userData = await getUser({ email: email })
	if (!userData) throw Boom.notFound("User not found")
	const matchPassword = await compareHash(password, userData.password)
	if (!matchPassword) throw Boom.forbidden("Incorrect password")
	const token = signAccessToken({
		user_id: userData.id,
		user_name: `${userData.first_name} ${userData.last_name}`,
		role: userData.role.name,
		workplace_id: userData.workplace.id,
		workplace_type: userData.workplace.workplace_type
	})
	const permissions = await getPermissionsArray(userData.role.id)
	return {
		token: token,
		user: {
			user_id: userData.id,
			user_name: `${userData.first_name} ${userData.last_name}`,
			workplace_id: userData.workplace.id,
			workplace_type: userData.workplace.workplace_type,
			role: userData.role.name,
			permissions: permissions
		}
	}
}

const forgotPasswordService = async (email) => {
	const userData = await getUser({ email: email });
	if (!userData) throw Boom.notFound("User not found");
	const otp = randomFixedInteger(4);
	const otpSendStatus = await sendOtpViaEmail(email, otp);
	await client.set(email, otp, 'EX', 60);
	return (otpSendStatus) ? true : false;
}

const verifyOtpService = async (email, otp) => {
	const userData = await getUser({ email: email });
	if (!userData) throw Boom.notFound("User not found");
	const getStoredOtp = await client.get(email)
	if (getStoredOtp && otp === parseInt(getStoredOtp)) {
		await client.set(email, JSON.stringify({ otpVarified: true }), 'EX', 180);
		const token = signAccessToken({
			email: userData.email
		}, expiresIn = '3m');

		return token;

	} else {
		await client.del(email);
		throw Boom.forbidden("Invalid OTP");
	}
}

const updatePasswordService = async (email, newPassword) => {
	const verificationStatus = await client.get(email)
	if (!JSON.parse(verificationStatus).otpVarified) throw Boom.unauthorized("Unathorized User");
	const hashedPassword = await createHashValue(newPassword);
	const updatedUser = await updateUserPassword(email, hashedPassword)
	await client.del(email);
	return updatedUser
}

module.exports = {
	createUserService,
	userLoginService,
	verifyOtpService,
	updatePasswordService,
	forgotPasswordService,
};