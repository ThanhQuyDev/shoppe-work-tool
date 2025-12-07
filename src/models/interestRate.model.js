const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const interestRateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    durationAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    minAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
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

// add plugin that converts mongoose to json
interestRateSchema.plugin(toJSON);
interestRateSchema.plugin(paginate);

/**
 * @typedef InterestRate
 */
const InterestRate = mongoose.model('InterestRate', interestRateSchema);

module.exports = InterestRate;
