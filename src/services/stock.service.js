const { CustomCoin } = require('../models');

/**
 * Query stocks (for users, without binanceSymbol)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryStocks = async (filter, options) => {
  // Only return active stocks by default if isActive is not specified
  if (filter.isActive === undefined) {
    filter.isActive = true;
  }
  // binanceSymbol will be automatically excluded by toJSON plugin (private: true)
  return CustomCoin.paginate(filter, options);
};

/**
 * Get stock by id (for users, without binanceSymbol)
 * @param {ObjectId} id
 * @returns {Promise<CustomCoin>}
 */
const getStockById = async (id) => {
  // binanceSymbol will be automatically excluded by toJSON plugin (private: true)
  return CustomCoin.findById(id);
};

module.exports = {
  queryStocks,
  getStockById,
};

