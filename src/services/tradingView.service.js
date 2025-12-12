const httpStatus = require('http-status');
const { CustomCoin } = require('../models');
const ApiError = require('../utils/ApiError');
const tradingViewExample = require('../example/trading-view.json');

const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

// Set to true to use example data instead of Binance API
const USE_EXAMPLE_DATA = true;

/**
 * Transform raw klines data to TradingView format
 * @param {Array} rawData
 * @param {number} limit
 * @returns {Array}
 */
const transformKlines = (rawData, limit) => {
  const data = rawData.slice(0, limit).map((candle) => ({
    time: Math.floor(candle[0] / 1000),
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
    volume: Number(candle[5]),
  }));
  return data;
};

/**
 * Fetch klines from Binance API
 * @param {string} binanceSymbol
 * @param {string} interval
 * @param {number} limit
 * @returns {Promise<Array>}
 */
const fetchFromBinance = async (binanceSymbol, interval, limit) => {
  const url = `${BINANCE_API_URL}?symbol=${binanceSymbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(response.status, errorData.msg || 'Failed to fetch data from Binance');
  }

  return response.json();
};

/**
 * Get klines data from Binance using custom coin symbol
 * @param {string} coinSymbol - Custom coin symbol (e.g., BTCC)
 * @param {string} interval - Time interval (e.g., 1m, 5m, 15m, 1h, 4h, 1d)
 * @param {number} limit - Number of data points (max 1000)
 * @returns {Promise<Array>}
 */
const getKlines = async (coinSymbol, interval, limit) => {
  // Tìm custom coin theo symbol
  const customCoin = await CustomCoin.findOne({ symbol: coinSymbol.toUpperCase() });

  if (!customCoin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }

  if (!customCoin.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Custom coin is not active');
  }

  try {
    let rawData;

    if (USE_EXAMPLE_DATA) {
      // Sử dụng data mẫu
      rawData = tradingViewExample;
    } else {
      // Gọi Binance API
      rawData = await fetchFromBinance(customCoin.binanceSymbol, interval, limit);
    }

    return transformKlines(rawData, limit);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch data');
  }
};

/**
 * Get klines data directly from Binance (for raw binance symbol)
 * @param {string} binanceSymbol - Binance trading pair (e.g., BTCUSDT)
 * @param {string} interval - Time interval
 * @param {number} limit - Number of data points
 * @returns {Promise<Array>}
 */
const getKlinesDirect = async (binanceSymbol, interval, limit) => {
  try {
    let rawData;

    if (USE_EXAMPLE_DATA) {
      // Sử dụng data mẫu
      rawData = tradingViewExample;
    } else {
      // Gọi Binance API
      rawData = await fetchFromBinance(binanceSymbol, interval, limit);
    }

    return transformKlines(rawData, limit);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch data');
  }
};

module.exports = {
  getKlines,
  getKlinesDirect,
};
