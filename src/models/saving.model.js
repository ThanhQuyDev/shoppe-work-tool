const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const savingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    interestRate: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'InterestRate',
      required: true,
    },
    interestRateSnapshot: {
      name: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      durationAmount: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
      minAmount: {
        type: Number,
        required: true,
      },
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    termMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    maturityDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'withdrawn'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

savingSchema.plugin(toJSON);
savingSchema.plugin(paginate);

/**
 * @typedef Saving
 */
const Saving = mongoose.model('Saving', savingSchema);

module.exports = Saving;
