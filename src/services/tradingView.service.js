const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

/**
 * Get klines data from Binance
 * @param {string} symbol - Trading pair (e.g., BTCUSDT)
 * @param {string} interval - Time interval (e.g., 1m, 5m, 15m, 1h, 4h, 1d)
 * @param {number} limit - Number of data points (max 1000)
 * @returns {Promise<Array>}
 */
const getKlines = async (symbol, interval, limit) => {
  try {
    const url = `${BINANCE_API_URL}?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.msg || 'Failed to fetch data from Binance');
    }

    const rawData = await response.json();

    // Transform data to TradingView format
    const data = rawData.map((candle) => ({
      time: Math.floor(candle[0] / 1000), // Convert ms to seconds
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
};
