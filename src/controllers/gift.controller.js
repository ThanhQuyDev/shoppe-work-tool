const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { giftService } = require('../services');

const createGift = catchAsync(async (req, res) => {
  const gift = await giftService.createGift(req.body);
  res.status(httpStatus.CREATED).send(gift);
});

const getGifts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await giftService.queryGifts(filter, options);
  res.send(result);
});

const getGift = catchAsync(async (req, res) => {
  const gift = await giftService.getGiftById(req.params.giftId);
  if (!gift) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gift not found');
  }
  res.send(gift);
});

const updateGift = catchAsync(async (req, res) => {
  const gift = await giftService.updateGiftById(req.params.giftId, req.body);
  res.send(gift);
});

const deleteGift = catchAsync(async (req, res) => {
  await giftService.deleteGiftById(req.params.giftId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createGift,
  getGifts,
  getGift,
  updateGift,
  deleteGift,
};

