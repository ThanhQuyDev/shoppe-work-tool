const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const customCoinSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    binanceSymbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      private: true, // Ẩn khỏi API response
    },
    description: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

customCoinSchema.plugin(toJSON);
customCoinSchema.plugin(paginate);

/**
 * Check if symbol is taken
 * @param {string} symbol - The coin symbol
 * @param {ObjectId} [excludeId] - The id to exclude
 * @returns {Promise<boolean>}
 */
customCoinSchema.statics.isSymbolTaken = async function (symbol, excludeId) {
  const coin = await this.findOne({ symbol: symbol.toUpperCase(), _id: { $ne: excludeId } });
  return !!coin;
};

/**
 * @typedef CustomCoin
 */
const CustomCoin = mongoose.model('CustomCoin', customCoinSchema);

module.exports = CustomCoin;

