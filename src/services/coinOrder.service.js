const httpStatus = require('http-status');
const { CoinOrder, CustomCoin, User } = require('../models');
const ApiError = require('../utils/ApiError');
const tradingViewService = require('./tradingView.service');

/**
 * Get delayed price (30 min) for buy/sell
 * Dùng chung getCurrentBar từ tradingView.service để đảm bảo giá nhất quán
 *
 * @param {string} coinSymbol - Custom coin symbol (e.g., BTCC)
 * @returns {Promise<number>} - close price
 */
const getCurrentPrice = async (coinSymbol) => {
  const bar = await tradingViewService.getCurrentBar(coinSymbol);
  return bar.close;
};

/**
 * Buy coin
 * @param {ObjectId} userId
 * @param {Object} orderBody
 * @returns {Promise<CoinOrder>}
 */
const buyCoin = async (userId, orderBody) => {
  const { symbol, amount } = orderBody;

  const customCoin = await CustomCoin.findOne({ symbol: symbol.toUpperCase() });
  if (!customCoin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }
  if (!customCoin.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Custom coin is not active');
  }

  const price = await getCurrentPrice(symbol.toUpperCase());
  const total = amount * price;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.balance < total) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  user.balance -= total;

  const currentAmount = user.wallet.get(symbol.toUpperCase()) || 0;
  user.wallet.set(symbol.toUpperCase(), currentAmount + amount);

  await user.save();

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

  const customCoin = await CustomCoin.findOne({ symbol: symbol.toUpperCase() });
  if (!customCoin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Custom coin not found');
  }
  if (!customCoin.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Custom coin is not active');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const currentAmount = user.wallet.get(symbol.toUpperCase()) || 0;
  if (currentAmount < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient coin balance');
  }

  const price = await getCurrentPrice(customCoin.binanceSymbol);
  const total = amount * price;

  user.balance += total;

  const newAmount = currentAmount - amount;
  if (newAmount === 0) {
    user.wallet.delete(symbol.toUpperCase());
  } else {
    user.wallet.set(symbol.toUpperCase(), newAmount);
  }

  await user.save();

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
 * Get user wallet with current (delayed) prices
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
      const price = await getCurrentPrice(symbol);
      wallet.push({
        symbol,
        coinName: customCoin.name,
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
