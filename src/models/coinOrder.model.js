const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const coinOrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    binanceSymbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    coinName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

coinOrderSchema.plugin(toJSON);
coinOrderSchema.plugin(paginate);

/**
 * @typedef CoinOrder
 */
const CoinOrder = mongoose.model('CoinOrder', coinOrderSchema);

module.exports = CoinOrder;

