const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const giftExchangeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    gift: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Gift',
      required: true,
    },
    pointsUsed: {
      type: Number,
      required: true,
      min: 0,
    },
    // Snapshot thông tin quà tặng tại thời điểm đổi
    giftSnapshot: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      pointsRequired: {
        type: Number,
        required: true,
      },
      img: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    rejectedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
giftExchangeSchema.plugin(toJSON);
giftExchangeSchema.plugin(paginate);

/**
 * @typedef GiftExchange
 */
const GiftExchange = mongoose.model('GiftExchange', giftExchangeSchema);

module.exports = GiftExchange;

