const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { giftExchangeService } = require('../services');

const createGiftExchange = catchAsync(async (req, res) => {
  const giftExchange = await giftExchangeService.createGiftExchange(req.user.id, req.body.giftId);
  res.status(httpStatus.CREATED).send(giftExchange);
});

const getGiftExchanges = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // User chỉ xem được gift exchange của mình
  filter.user = req.user.id;
  const result = await giftExchangeService.queryGiftExchanges(filter, options);
  res.send(result);
});

const getAllGiftExchanges = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await giftExchangeService.queryAllGiftExchangesWithInfo(filter, options);
  res.send(result);
});

const getGiftExchange = catchAsync(async (req, res) => {
  const giftExchange = await giftExchangeService.getGiftExchangeById(req.params.giftExchangeId);
  if (!giftExchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gift exchange not found');
  }
  // User chỉ xem được gift exchange của mình
  if (req.user.role !== 'admin' && giftExchange.user._id.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.send(giftExchange);
});

const approveGiftExchange = catchAsync(async (req, res) => {
  const giftExchange = await giftExchangeService.approveGiftExchange(req.params.giftExchangeId, req.user.id);
  res.send(giftExchange);
});

const rejectGiftExchange = catchAsync(async (req, res) => {
  const giftExchange = await giftExchangeService.rejectGiftExchange(req.params.giftExchangeId, req.user.id);
  res.send(giftExchange);
});

module.exports = {
  createGiftExchange,
  getGiftExchanges,
  getAllGiftExchanges,
  getGiftExchange,
  approveGiftExchange,
  rejectGiftExchange,
};

