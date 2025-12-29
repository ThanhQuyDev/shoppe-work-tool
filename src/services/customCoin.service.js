const httpStatus = require('http-status');
const { CustomCoin } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a custom coin
 * @param {Object} coinBody
 * @returns {Promise<CustomCoin>}
 */
const createCustomCoin = async (coinBody) => {
  if (await CustomCoin.isSymbolTaken(coinBody.symbol)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Symbol already taken');
  }
  return CustomCoin.create(coinBody);
};

/**
 * Query custom coins
 * @param {Object} filter
 * @param {Object} options
 * @param {boolean} includeBinanceSymbol - Whether to include binanceSymbol in response
 * @returns {Promise<QueryResult>}
 */
const queryCustomCoins = async (filter, options, includeBinanceSymbol = false) => {
  const result = await CustomCoin.paginate(filter, options);
  if (includeBinanceSymbol && result.results) {
    // Manually add binanceSymbol to each result since it's marked as private
    result.results = result.results.map((coin) => {
      const coinJson = coin.toJSON ? coin.toJSON() : coin;
      // Get binanceSymbol from the original document
      coinJson.binanceSymbol = coin.binanceSymbol;
      return coinJson;
    });
  }
  return result;
};
const getListStocks = async () => {
  const stocks = await CustomCoin.find({ isActive: true });
  return stocks.map((stock) => ({
    id: stock._id,
    name: stock.name,
    symbol: stock.symbol,
    description: stock.description,
    img: stock.img,
  }));
};

/**
 * Get custom coin by id
 * @param {ObjectId} id
 * @param {boolean} includeBinanceSymbol - Whether to include binanceSymbol in response
 * @returns {Promise<CustomCoin>}
 */
const getCustomCoinById = async (id, includeBinanceSymbol = false) => {
  const coin = await CustomCoin.findById(id);
  if (!coin) {
    return null;
  }
  if (includeBinanceSymbol) {
    // Convert to JSON and manually add binanceSymbol since it's marked as private
    const coinJson = coin.toJSON();
    coinJson.binanceSymbol = coin.binanceSymbol;
    return coinJson;
  }
  return coin;
};

/**
 * Get custom coin by symbol
 * @param {string} symbol
 * @returns {Promise<CustomCoin>}
 */
const getCustomCoinBySymbol = async (symbol) => {
  return CustomCoin.findOne({ symbol: symbol.toUpperCase() });
};

/**
 * Update custom coin by id
 * @param {ObjectId} coinId
 * @param {Object} updateBody
 * @returns {Promise<CustomCoin>}
 */
const updateCustomCoinById = async (coinId, updateBody) => {
  const coin = await getCustomCoinById(coinId);
  if (!coin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }

  if (updateBody.symbol && (await CustomCoin.isSymbolTaken(updateBody.symbol, coinId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Symbol already taken');
  }

  Object.assign(coin, updateBody);
  await coin.save();
  return coin;
};

/**
 * Delete custom coin by id
 * @param {ObjectId} coinId
 * @returns {Promise<CustomCoin>}
 */
const deleteCustomCoinById = async (coinId) => {
  const coin = await getCustomCoinById(coinId);
  if (!coin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }
  await coin.deleteOne();
  return coin;
};

/**
 * Get all active custom coins
 * @returns {Promise<CustomCoin[]>}
 */
const getActiveCustomCoins = async () => {
  return CustomCoin.find({ isActive: true });
};

module.exports = {
  createCustomCoin,
  queryCustomCoins,
  getCustomCoinById,
  getCustomCoinBySymbol,
  updateCustomCoinById,
  deleteCustomCoinById,
  getActiveCustomCoins,
  getListStocks,
};

