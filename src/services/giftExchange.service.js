const httpStatus = require('http-status');
const { GiftExchange, Gift, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a gift exchange request
 * @param {ObjectId} userId
 * @param {ObjectId} giftId
 * @returns {Promise<GiftExchange>}
 */
const createGiftExchange = async (userId, giftId) => {
  const [user, gift] = await Promise.all([User.findById(userId), Gift.findById(giftId)]);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!gift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gift not found');
  }

  if (!gift.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Gift is not active');
  }

  if (user.points < gift.pointsRequired) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient points');
  }

  // Trừ điểm ngay khi tạo request
  user.points -= gift.pointsRequired;
  await user.save();

  // Tạo gift exchange với snapshot của gift
  const giftExchange = await GiftExchange.create({
    user: userId,
    gift: giftId,
    pointsUsed: gift.pointsRequired,
    giftSnapshot: {
      name: gift.name,
      description: gift.description,
      pointsRequired: gift.pointsRequired,
      img: gift.img,
    },
    status: 'pending',
  });

  return giftExchange;
};

/**
 * Query gift exchanges
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryGiftExchanges = async (filter, options) => {
  return GiftExchange.paginate(filter, options);
};

/**
 * Query all gift exchanges with user and gift info (for admin)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryAllGiftExchangesWithInfo = async (filter, options) => {
  const optionsWithPopulate = {
    ...options,
    populate: 'user,gift',
  };
  return GiftExchange.paginate(filter, optionsWithPopulate);
};

/**
 * Get gift exchange by id
 * @param {ObjectId} giftExchangeId
 * @returns {Promise<GiftExchange>}
 */
const getGiftExchangeById = async (giftExchangeId) => {
  return GiftExchange.findById(giftExchangeId).populate('user gift');
};

/**
 * Approve a gift exchange
 * @param {ObjectId} giftExchangeId
 * @param {ObjectId} adminId
 * @returns {Promise<GiftExchange>}
 */
const approveGiftExchange = async (giftExchangeId, adminId) => {
  const giftExchange = await getGiftExchangeById(giftExchangeId);
  if (!giftExchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gift exchange not found');
  }

  if (giftExchange.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Gift exchange is not pending');
  }

  // Cập nhật status thành approved
  giftExchange.status = 'approved';
  giftExchange.approvedBy = adminId;
  giftExchange.approvedAt = new Date();
  await giftExchange.save();

  return giftExchange;
};

/**
 * Reject a gift exchange
 * @param {ObjectId} giftExchangeId
 * @param {ObjectId} adminId
 * @returns {Promise<GiftExchange>}
 */
const rejectGiftExchange = async (giftExchangeId, adminId) => {
  const giftExchange = await getGiftExchangeById(giftExchangeId);
  if (!giftExchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gift exchange not found');
  }

  if (giftExchange.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Gift exchange is not pending');
  }

  // Trả lại điểm cho user
  const user = await User.findById(giftExchange.user);
  if (user) {
    user.points += giftExchange.pointsUsed;
    await user.save();
  }

  // Cập nhật status thành rejected
  giftExchange.status = 'rejected';
  giftExchange.rejectedBy = adminId;
  giftExchange.rejectedAt = new Date();
  await giftExchange.save();

  return giftExchange;
};

module.exports = {
  createGiftExchange,
  queryGiftExchanges,
  queryAllGiftExchangesWithInfo,
  getGiftExchangeById,
  approveGiftExchange,
  rejectGiftExchange,
};

