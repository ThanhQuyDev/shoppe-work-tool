const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { customCoinService } = require('../services');

const createCustomCoin = catchAsync(async (req, res) => {
  const coin = await customCoinService.createCustomCoin(req.body);
  res.status(httpStatus.CREATED).send(coin);
});

const getCustomCoins = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'symbol', 'binanceSymbol', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await customCoinService.queryCustomCoins(filter, options);
  res.send(result);
});
const getListStocks = catchAsync(async (req, res) => {
  const stocks = await customCoinService.getListStocks();
  res.send(stocks);
});

const getCustomCoin = catchAsync(async (req, res) => {
  const coin = await customCoinService.getCustomCoinById(req.params.coinId);
  if (!coin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }
  res.send(coin);
});

const updateCustomCoin = catchAsync(async (req, res) => {
  const coin = await customCoinService.updateCustomCoinById(req.params.coinId, req.body);
  res.send(coin);
});

const deleteCustomCoin = catchAsync(async (req, res) => {
  await customCoinService.deleteCustomCoinById(req.params.coinId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getActiveCoins = catchAsync(async (req, res) => {
  const coins = await customCoinService.getActiveCustomCoins();
  res.send(coins);
});

module.exports = {
  createCustomCoin,
  getCustomCoins,
  getCustomCoin,
  updateCustomCoin,
  deleteCustomCoin,
  getActiveCoins,
  getListStocks,
};

