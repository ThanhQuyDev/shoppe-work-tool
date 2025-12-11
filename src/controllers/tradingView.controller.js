const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tradingViewService } = require('../services');

/**
 * Get klines by custom coin symbol
 */
const getKlines = catchAsync(async (req, res) => {
  const { symbol, interval = '1h', limit = 200 } = req.query;

  if (!symbol) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Symbol is required');
  }

  const data = await tradingViewService.getKlines(symbol, interval, Number(limit));
  res.send(data);
});

/**
 * Get klines directly from Binance (using binance symbol)
 */
const getKlinesDirect = catchAsync(async (req, res) => {
  const { symbol = 'BTCUSDT', interval = '1h', limit = 200 } = req.query;
  const data = await tradingViewService.getKlinesDirect(symbol, interval, Number(limit));
  res.send(data);
});

module.exports = {
  getKlines,
  getKlinesDirect,
};
