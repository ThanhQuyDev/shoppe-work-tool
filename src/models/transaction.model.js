const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdraw'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Snapshot thông tin ngân hàng tại thời điểm giao dịch
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    bankNumber: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
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
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
