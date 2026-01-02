const httpStatus = require('http-status');
const { Gift } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a gift
 * @param {Object} giftBody
 * @returns {Promise<Gift>}
 */
const createGift = async (giftBody) => {
  return Gift.create(giftBody);
};

/**
 * Query gifts
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryGifts = async (filter, options) => {
  return Gift.paginate(filter, options);
};

/**
 * Get gift by id
 * @param {ObjectId} id
 * @returns {Promise<Gift>}
 */
const getGiftById = async (id) => {
  return Gift.findById(id);
};

/**
 * Update gift by id
 * @param {ObjectId} giftId
 * @param {Object} updateBody
 * @returns {Promise<Gift>}
 */
const updateGiftById = async (giftId, updateBody) => {
  const gift = await getGiftById(giftId);
  if (!gift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gift not found');
  }

  Object.assign(gift, updateBody);
  await gift.save();
  return gift;
};

/**
 * Delete gift by id
 * @param {ObjectId} giftId
 * @returns {Promise<Gift>}
 */
const deleteGiftById = async (giftId) => {
  const gift = await getGiftById(giftId);
  if (!gift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gift not found');
  }
  await gift.deleteOne();
  return gift;
};

module.exports = {
  createGift,
  queryGifts,
  getGiftById,
  updateGiftById,
  deleteGiftById,
};

