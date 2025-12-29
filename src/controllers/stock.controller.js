const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { stockService } = require('../services');

const getStocks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'symbol', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await stockService.queryStocks(filter, options);
  res.send(result);
});

const getStock = catchAsync(async (req, res) => {
  const stock = await stockService.getStockById(req.params.stockId);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock not found');
  }
  res.send(stock);
});

module.exports = {
  getStocks,
  getStock,
};

