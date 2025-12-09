const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const systemBankAccountSchema = mongoose.Schema(
  {
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

systemBankAccountSchema.plugin(toJSON);

/**
 * Check if system bank account already exists
 * @param {ObjectId} [excludeId] - The id of the bank account to exclude
 * @returns {Promise<boolean>}
 */
systemBankAccountSchema.statics.exists = async function (excludeId) {
  const bankAccount = await this.findOne({
    _id: { $ne: excludeId },
  });
  return !!bankAccount;
};

/**
 * @typedef SystemBankAccount
 */
const SystemBankAccount = mongoose.model('SystemBankAccount', systemBankAccountSchema);

module.exports = SystemBankAccount;

