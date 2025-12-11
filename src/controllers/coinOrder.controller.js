const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { coinOrderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const order = await coinOrderService.createOrder(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['symbol', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // User chỉ xem được order của mình
  if (req.user.role !== 'admin') {
    filter.user = req.user.id;
  } else if (req.query.user) {
    filter.user = req.query.user;
  }

  // Default sort by newest
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  const result = await coinOrderService.queryOrders(filter, options);
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await coinOrderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  // User chỉ xem được order của mình
  if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.send(order);
});

const getMyWallet = catchAsync(async (req, res) => {
  const wallet = await coinOrderService.getUserWallet(req.user.id);
  res.send(wallet);
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  getMyWallet,
};

