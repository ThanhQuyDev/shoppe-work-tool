const httpStatus = require('http-status');
const { CustomCoin } = require('../models');
const ApiError = require('../utils/ApiError');
const tradingViewExample = require('../example/trading-view.json');

const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

/**
 * Get klines data from Binance using custom coin symbol
 * @param {string} coinSymbol - Custom coin symbol (e.g., BTCC)
 * @param {string} interval - Time interval (e.g., 1m, 5m, 15m, 1h, 4h, 1d)
 * @param {number} limit - Number of data points (max 1000)
 * @returns {Promise<Object>}
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
    // Sử dụng binanceSymbol của custom coin để gọi Binance API
    const url = `${BINANCE_API_URL}?symbol=${customCoin.binanceSymbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.msg || 'Failed to fetch data from Binance');
    }

    const rawData = await response.json();

    // Transform data to TradingView format
    const klines = rawData.map((candle) => ({
      time: Math.floor(candle[0] / 1000), // Convert ms to seconds
      open: Number(candle[1]),
      high: Number(candle[2]),
      low: Number(candle[3]),
      close: Number(candle[4]),
      volume: Number(candle[5]),
    }));

    // Trả về thông tin coin kèm data
    return klines
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch data from Binance');
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
    const url = `${BINANCE_API_URL}?symbol=${binanceSymbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
    let response = await fetch(url);

    if (!response.ok) {
      response = tradingViewExample;
      // const errorData = await response.json();
      // throw new ApiError(response.status, errorData.msg || 'Failed to fetch data from Binance');
    }

    const rawData = await response.json();

    // Transform data to TradingView format
    const data = rawData.map((candle) => ({
      time: Math.floor(candle[0] / 1000),
      open: Number(candle[1]),
      high: Number(candle[2]),
      low: Number(candle[3]),
      close: Number(candle[4]),
      volume: Number(candle[5]),
    }));

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch data from Binance');
  }
};

module.exports = {
  getKlines,
  getKlinesDirect,
};
