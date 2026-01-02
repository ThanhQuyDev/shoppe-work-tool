const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const giftSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    pointsRequired: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    img: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

giftSchema.plugin(toJSON);
giftSchema.plugin(paginate);

/**
 * @typedef Gift
 */
const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;

