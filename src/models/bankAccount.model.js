const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const bankAccountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Mỗi user chỉ có 1 tài khoản ngân hàng
    },
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
  },
  {
    timestamps: true,
  }
);

bankAccountSchema.plugin(toJSON);
bankAccountSchema.plugin(paginate);

/**
 * Check if user already has a bank account linked
 * @param {ObjectId} userId - User id
 * @param {ObjectId} [excludeId] - The id of the bank account to exclude
 * @returns {Promise<boolean>}
 */
bankAccountSchema.statics.isUserLinked = async function (userId, excludeId) {
  const bankAccount = await this.findOne({
    user: userId,
    _id: { $ne: excludeId },
  });
  return !!bankAccount;
};

/**
 * @typedef BankAccount
 */
const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;
