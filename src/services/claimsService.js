const _ = require("lodash");
const { In } = require("typeorm");
const Boom = require("@hapi/boom");
const { dataSource } = require("../../infrastructure/postgres");
const { findOne, } = require("../repositories/orderRepository");
const { fileClaimRepository, findClaimRepository, claimImageUploadRepo, claimImageUpdateRepo, warehouseClaimsRepo, warehouseClaimsCountRepo } = require("../repositories/claimsRepository");
const { uploadToCloudinary } = require("../helpers/imgUploadHelper");
const { getWorkplace } = require("../repositories/workplaceRepo");
const { convertToWebPBuffer } = require("../helpers/webpConverterHelper");
const { updateOrder } = require("./orderService");

const fileClaimService = async (userId, orderId, productId, message, claimType, missingQuantity, claim_images_ids = []) => {
	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		const checkOrder = await findOne({ id: orderId });
		const calimExists = await findClaimRepository({
			order_id: orderId,
			product_id: productId,
			claim_type: claimType,
			claim_status: In(["pending", "accepted", "picked", "packed", "in-transit"]),
		});
		if (!_.isNil(calimExists)) throw Boom.conflict("Claim is already filed");

		if (!["claimed", "in-transit"].includes(checkOrder.order_status)) throw Boom.forbidden("You cannot file a claim at this moment");


		const filedClaim = await fileClaimRepository({
			order_id: orderId,
			product_id: productId,
			message,
			claim_type: claimType,
			quantity: missingQuantity,
		});

		for (const claim_images_id of claim_images_ids) {
			await claimImageUpdateRepo({ claim_id: filedClaim.id }, { id: claim_images_id });
		}

		await updateOrder(orderId, "claimed", userId)

		await queryRunner.commitTransaction();
		return filedClaim;
	} catch (error) {
		await queryRunner.rollbackTransaction();
		throw Error(error.message);
	}
	finally {
		await queryRunner.release();
	}
};

const uploadService = async (file) => {
	if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
		throw Boom.unsupportedMediaType('Invalid file type. Only jpg, png, jpeg, webp are allowed.');
	}
	const imageBuffer = await file.toBuffer();
	const webpBuffer = (file.mimetype !== 'image/webp') ? await convertToWebPBuffer(imageBuffer) : imageBuffer
	const upload = await uploadToCloudinary(webpBuffer);
	const storeToDB = await claimImageUploadRepo(upload);
	return storeToDB;
};

const warehouseClaimsService = async (workplaceId, workplace_type, status) => {
	const workplace = await getWorkplace({
		id: workplaceId,
		workplace_type,
	});

	if(_.isNil(workplace)) throw Boom.forbidden("The workplace does not exists")

	const obj = {
		ongoing: ["accepted", "picked", "packed", "in-transit", ],
		completed: ["resolved"],
	};
	const filter = {
		claim_status: obj[status],
		warehouse_id: workplace.workplace_id,
		order_status: "claimed",
	};
	const result = await warehouseClaimsRepo(filter);
	return result;
}

const warehouseClaimsCountService = async (workplaceId, status = "ongoing") => {
	const obj = {
		ongoing: ["accepted", "picked", "packed", "in-transit", "resolved" ],
	};

	const filter = {
		claim_status: obj[status],
		warehouse_id: workplaceId,
		order_status: "claimed",
	};
	const result = await warehouseClaimsCountRepo(filter);
	return result;
};

module.exports = {
	fileClaimService,
	uploadService,
	warehouseClaimsService,
	warehouseClaimsCountService,
};
