const Boom = require("@hapi/boom");
const _ = require("lodash");
const { dataSource } = require("../../infrastructure/postgres");
const { In } = require("typeorm");

const findClaimRepository = async (filter) => {
	const claimRepository = dataSource.getRepository("Claim");
	const data = await claimRepository.findOne({ where: filter });
	return data;
};

const fileClaimRepository = async (claim) => {
	const claimRepository = dataSource.getRepository("Claim");
	const fileClaim = claimRepository.create(claim);
	const filedClaim = await claimRepository.save(fileClaim);
	return filedClaim;
};

const claimImageUploadRepo = async (image_url) => {
	const claimImageRepo = dataSource.getRepository("ClaimImage");
	const create = claimImageRepo.create({ image_url });
	const save = await claimImageRepo.save(create);
	return save;
};

const claimImageUpdateRepo = async (payload, filter) => {
	const claimImageRepo = dataSource.getRepository("ClaimImage");
	const existing = await claimImageRepo.findOne({ where: filter });
	if (_.isNil(existing)) throw Error(Boom.notFound("claim image not found of filter ", filter));

	const merge = claimImageRepo.merge(existing, payload);
	const save = await claimImageRepo.save(merge);
	return save;
};

const warehouseClaimsRepo = async (filter) => {
	const claimRepository = dataSource.getRepository("Order");
	const claims = await claimRepository
		.createQueryBuilder("order")
		.leftJoinAndSelect("order.claim", "claim")
		.leftJoinAndSelect("claim.product", "product")
		.leftJoinAndSelect("order.store", "store")
		.select([
			"claim.id",
			"claim.claim_type",
			"claim.message",
			"claim.quantity",
			"claim.claim_status",
			"claim.created_at",
			"order.id",
			"order.user_id",
			"order.order_status",
			"store.id",
			"store.name",
			"store.location",
			"product.id",
			"product.title",
			"product.thumbnail_image_url",
			"product.selling_price",
			"product.pack_of",
		])
		.where("claim.claim_status IN (:...claim_status)", { claim_status: filter.claim_status })
		.andWhere({ warehouse_id: filter?.warehouse_id })
		.andWhere({ order_status: filter?.order_status })
		.getMany();
	return claims;
};

const warehouseClaimsCountRepo = async (filter) => {
	const claimRepository = dataSource.getRepository("Order");
	const claims = await claimRepository
		.createQueryBuilder("order")
		.leftJoinAndSelect("order.claim", "claim")
		.leftJoinAndSelect("claim.product", "product")
		.leftJoinAndSelect("order.store", "store")
		.select(["claim.id"])
		.where("claim.claim_status IN (:...claim_status)", { claim_status: filter.claim_status })
		.andWhere({ warehouse_id: filter?.warehouse_id })
		.andWhere({ order_status: filter?.order_status })
		.getCount();
	return claims;
};

module.exports = {
	findClaimRepository,
	fileClaimRepository,
	claimImageUploadRepo,
	claimImageUpdateRepo,
	warehouseClaimsRepo,
	warehouseClaimsCountRepo,
};
