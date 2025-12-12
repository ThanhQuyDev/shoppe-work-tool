const httpStatus = require('http-status');
const { CustomCoin } = require('../models');
const ApiError = require('../utils/ApiError');
const tradingViewExample = require('../example/trading-view.json');

const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

// Set to true to use example data instead of Binance API
const USE_EXAMPLE_DATA = false;

// Delay in minutes - data sẽ muộn hơn 30 phút
const DELAY_MINUTES = 30;

/**
 * Get interval duration in minutes
 * @param {string} interval
 * @returns {number}
 */
const getIntervalMinutes = (interval) => {
  const map = {
    '1m': 1,
    '3m': 3,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '2h': 120,
    '4h': 240,
    '6h': 360,
    '8h': 480,
    '12h': 720,
    '1d': 1440,
    '3d': 4320,
    '1w': 10080,
    '1M': 43200,
  };
  return map[interval] || 60;
};

/**
 * Calculate candles to remove for consistent 30 min delay
 * Formula: floor(DELAY / interval) + 1
 * - +1 để xóa nến đang forming
 * - floor(DELAY / interval) để xóa đủ số nến = 30 phút
 *
 * Ví dụ tại 16:35 muốn delay 30 phút (target ~16:05):
 * - 1m:  floor(30/1) + 1 = 31 nến → giữ nến 16:04 (close 16:05) ✓
 * - 5m:  floor(30/5) + 1 = 7 nến  → giữ nến 15:55 (close 16:00) ✓
 * - 15m: floor(30/15) + 1 = 3 nến → giữ nến 15:45 (close 16:00) ✓
 * - 30m: floor(30/30) + 1 = 2 nến → giữ nến 15:30 (close 16:00) ✓
 * - 1h:  floor(30/60) + 1 = 1 nến → giữ nến 15:00 (close 16:00) ✓
 * - 4h:  floor(30/240) + 1 = 1 nến → giữ nến 12:00 (close 16:00) ✓
 * - 1d:  floor(30/1440) + 1 = 1 nến → giữ nến hôm qua ✓
 *
 * @param {number} intervalMinutes
 * @returns {number}
 */
const calculateCandlesToRemove = (intervalMinutes) => {
  return Math.floor(DELAY_MINUTES / intervalMinutes) + 1;
};

/**
 * Transform raw klines data to TradingView format with FIXED 30 min delay
 * @param {Array} rawData
 * @param {number} limit
 * @param {string} interval
 * @returns {Array}
 */
const transformKlines = (rawData, limit, interval) => {
  const intervalMinutes = getIntervalMinutes(interval);
  const candlesToRemove = calculateCandlesToRemove(intervalMinutes);

  // Time offset luôn = 30 phút để đồng bộ giữa các interval
  const timeOffsetSeconds = DELAY_MINUTES * 60;

  // Xoá các nến mới nhất (cuối mảng)
  const delayedData = rawData.slice(0, -candlesToRemove);

  const data = delayedData
    .slice(-limit)
    .map((candle) => ({
      time: Math.floor(candle[0] / 1000) + timeOffsetSeconds,
      open: Number(candle[1]),
      high: Number(candle[2]),
      low: Number(candle[3]),
      close: Number(candle[4]),
      volume: Number(candle[5]),
    }))
    .reverse();

  return data;
};

/**
 * Fetch klines from Binance API with extra candles for delay
 * @param {string} binanceSymbol
 * @param {string} interval
 * @param {number} limit
 * @returns {Promise<Array>}
 */
const fetchFromBinance = async (binanceSymbol, interval, limit) => {
  const intervalMinutes = getIntervalMinutes(interval);
  const candlesToRemove = calculateCandlesToRemove(intervalMinutes);

  // Fetch thêm nến để sau khi xóa vẫn đủ limit
  const fetchLimit = Math.min(limit + candlesToRemove + 10, 1000);

  const url = `${BINANCE_API_URL}?symbol=${binanceSymbol.toUpperCase()}&interval=${interval}&limit=${fetchLimit}`;
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
      rawData = tradingViewExample;
    } else {
      rawData = await fetchFromBinance(customCoin.binanceSymbol, interval, limit);
    }

    return transformKlines(rawData, limit, interval);
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
      rawData = tradingViewExample;
    } else {
      rawData = await fetchFromBinance(binanceSymbol, interval, limit);
    }

    return transformKlines(rawData, limit, interval);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch data');
  }
};

/**
 * Get current bar (delayed 30 min) for real-time update
 * Dùng nến 1m để cập nhật mượt hơn (mỗi phút có nến mới)
 *
 * Với nến 1m và delay 30 phút:
 * - candlesToRemove = floor(30/1) + 1 = 31
 * - Fetch 32 nến, lấy data[0] = nến đã close đúng 30 phút trước
 *
 * FE dùng useEffect polling API này mỗi 1-5 giây để cập nhật chart
 *
 * @param {string} coinSymbol - Custom coin symbol (e.g., BTCC)
 * @returns {Promise<Object>} - { time, open, high, low, close, volume }
 */
const getCurrentBar = async (coinSymbol) => {
  const customCoin = await CustomCoin.findOne({ symbol: coinSymbol.toUpperCase() });

  if (!customCoin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }

  if (!customCoin.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Custom coin is not active');
  }

  try {
    let candle;

    if (USE_EXAMPLE_DATA) {
      // Với example data (nến 30m), lấy nến thứ 2 từ cuối
      if (tradingViewExample.length < 3) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No data available');
      }
      candle = tradingViewExample[tradingViewExample.length - 3];
    } else {
      // Dùng nến 1m với delay 30 phút
      // candlesToRemove = floor(30/1) + 1 = 31
      // Fetch 32 nến để lấy nến đã close đúng 30 phút trước
      const candlesToFetch = 32;
      const url = `${BINANCE_API_URL}?symbol=${customCoin.binanceSymbol.toUpperCase()}&interval=1m&limit=${candlesToFetch}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to fetch from Binance');
      }

      const data = await response.json();
      if (data.length < candlesToFetch) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough data');
      }

      // data[0] = nến cũ nhất = close đúng 30 phút trước
      candle = data[0];
    }

    // Shift time 30 phút để khớp với chart
    const timeOffsetSeconds = DELAY_MINUTES * 60;

    return {
      time: Math.floor(candle[0] / 1000) + timeOffsetSeconds,
      open: Number(candle[1]),
      high: Number(candle[2]),
      low: Number(candle[3]),
      close: Number(candle[4]),
      volume: Number(candle[5]),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch current bar');
  }
};

module.exports = {
  getKlines,
  getKlinesDirect,
  getCurrentBar,
  getIntervalMinutes,
  calculateCandlesToRemove,
  DELAY_MINUTES,
};
