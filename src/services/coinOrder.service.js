const httpStatus = require('http-status');
const { CoinOrder, CustomCoin, User } = require('../models');
const ApiError = require('../utils/ApiError');
const tradingViewExample = require('../example/trading-view.json');

const BINANCE_API_URL = 'https://api.binance.com/api/v3/klines';

// Set to true to use example data instead of Binance API
const USE_EXAMPLE_DATA = true;

/**
 * Get current price from Binance or example data
 * @param {string} binanceSymbol
 * @returns {Promise<number>}
 */
const getCurrentPrice = async (binanceSymbol) => {
  try {
    if (USE_EXAMPLE_DATA) {
      // Lấy giá close của nến cuối cùng trong example data
      if (tradingViewExample.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No price data available');
      }
      const lastCandle = tradingViewExample[tradingViewExample.length - 1];
      return Number(lastCandle[4]); // close price
    }

    // Gọi Binance API
    const url = `${BINANCE_API_URL}?symbol=${binanceSymbol}&interval=1m&limit=1`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to fetch price from Binance');
    }

    const data = await response.json();
    if (data.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No price data available');
    }

    // Return the close price of the latest candle
    return Number(data[0][4]);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch price');
  }
};

/**
 * Buy coin
 * @param {ObjectId} userId
 * @param {Object} orderBody
 * @returns {Promise<CoinOrder>}
 */
const buyCoin = async (userId, orderBody) => {
  const { symbol, amount } = orderBody;

  // Find custom coin
  const customCoin = await CustomCoin.findOne({ symbol: symbol.toUpperCase() });
  if (!customCoin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }
  if (!customCoin.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Custom coin is not active');
  }

  // Get current price
  const price = await getCurrentPrice(customCoin.binanceSymbol);
  const total = amount * price;

  // Check user balance
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.balance < total) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  // Deduct balance
  user.balance -= total;

  // Add to wallet
  const currentAmount = user.wallet.get(symbol.toUpperCase()) || 0;
  user.wallet.set(symbol.toUpperCase(), currentAmount + amount);

  await user.save();

  // Create order
  const order = await CoinOrder.create({
    user: userId,
    symbol: symbol.toUpperCase(),
    binanceSymbol: customCoin.binanceSymbol,
    type: 'buy',
    amount,
    price,
    total,
    coinName: customCoin.name,
  });

  return order;
};

/**
 * Sell coin
 * @param {ObjectId} userId
 * @param {Object} orderBody
 * @returns {Promise<CoinOrder>}
 */
const sellCoin = async (userId, orderBody) => {
  const { symbol, amount } = orderBody;

  // Find custom coin
  const customCoin = await CustomCoin.findOne({ symbol: symbol.toUpperCase() });
  if (!customCoin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }
  if (!customCoin.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Custom coin is not active');
  }

  // Check user wallet
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const currentAmount = user.wallet.get(symbol.toUpperCase()) || 0;
  if (currentAmount < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient coin balance');
  }

  // Get current price
  const price = await getCurrentPrice(customCoin.binanceSymbol);
  const total = amount * price;

  // Add to balance
  user.balance += total;

  // Deduct from wallet
  const newAmount = currentAmount - amount;
  if (newAmount === 0) {
    user.wallet.delete(symbol.toUpperCase());
  } else {
    user.wallet.set(symbol.toUpperCase(), newAmount);
  }

  await user.save();

  // Create order
  const order = await CoinOrder.create({
    user: userId,
    symbol: symbol.toUpperCase(),
    binanceSymbol: customCoin.binanceSymbol,
    type: 'sell',
    amount,
    price,
    total,
    coinName: customCoin.name,
  });

  return order;
};

/**
 * Create order (buy or sell)
 * @param {ObjectId} userId
 * @param {Object} orderBody
 * @returns {Promise<CoinOrder>}
 */
const createOrder = async (userId, orderBody) => {
  const { type } = orderBody;

  if (type === 'buy') {
    return buyCoin(userId, orderBody);
  }
  return sellCoin(userId, orderBody);
};

/**
 * Query orders
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  return CoinOrder.paginate(filter, options);
};

/**
 * Get order by id
 * @param {ObjectId} orderId
 * @returns {Promise<CoinOrder>}
 */
const getOrderById = async (orderId) => {
  return CoinOrder.findById(orderId);
};

/**
 * Get user wallet with current prices
 * @param {ObjectId} userId
 * @returns {Promise<Object>}
 */
const getUserWallet = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const wallet = [];
  const walletMap = user.wallet || new Map();

  for (const [symbol, amount] of walletMap) {
    const customCoin = await CustomCoin.findOne({ symbol });
    if (customCoin) {
      const price = await getCurrentPrice(customCoin.binanceSymbol);
      wallet.push({
        symbol,
        coinName: customCoin.name,
        binanceSymbol: customCoin.binanceSymbol,
        img: customCoin.img,
        amount,
        currentPrice: price,
        totalValue: amount * price,
      });
    }
  }

  return {
    balance: user.balance,
    wallet,
    totalWalletValue: wallet.reduce((sum, item) => sum + item.totalValue, 0),
  };
};

module.exports = {
  createOrder,
  buyCoin,
  sellCoin,
  queryOrders,
  getOrderById,
  getUserWallet,
  getCurrentPrice,
};
