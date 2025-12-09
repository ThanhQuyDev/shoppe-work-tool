const httpStatus = require('http-status');
const { SystemBankAccount } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create system bank account (only one allowed)
 * @param {Object} bankAccountBody
 * @returns {Promise<SystemBankAccount>}
 */
const createSystemBankAccount = async (bankAccountBody) => {
  // Check if system bank account already exists
  if (await SystemBankAccount.exists()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'System bank account already exists');
  }

  const bankAccount = await SystemBankAccount.create(bankAccountBody);
  return bankAccount;
};

/**
 * Get system bank account
 * @returns {Promise<SystemBankAccount>}
 */
const getSystemBankAccount = async () => {
  const bankAccount = await SystemBankAccount.findOne();
  return bankAccount;
};

/**
 * Update system bank account
 * @param {Object} updateBody
 * @returns {Promise<SystemBankAccount>}
 */
const updateSystemBankAccount = async (updateBody) => {
  const bankAccount = await SystemBankAccount.findOne();
  if (!bankAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'System bank account not found');
  }

  Object.assign(bankAccount, updateBody);
  await bankAccount.save();
  return bankAccount;
};

/**
 * Delete system bank account
 * @returns {Promise<SystemBankAccount>}
 */
const deleteSystemBankAccount = async () => {
  const bankAccount = await SystemBankAccount.findOne();
  if (!bankAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'System bank account not found');
  }

  await bankAccount.deleteOne();
  return bankAccount;
};

module.exports = {
  createSystemBankAccount,
  getSystemBankAccount,
  updateSystemBankAccount,
  deleteSystemBankAccount,
};

