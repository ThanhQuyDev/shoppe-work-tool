const httpStatus = require('http-status');
const { BankAccount } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a bank account link for user (only one per user)
 * @param {ObjectId} userId
 * @param {Object} bankAccountBody
 * @returns {Promise<BankAccount>}
 */
const createBankAccount = async (userId, bankAccountBody) => {
  const { bankName, bankNumber, userName } = bankAccountBody;

  // Check if user already has a bank account linked
  if (await BankAccount.isUserLinked(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already has a bank account linked');
  }

  const bankAccount = await BankAccount.create({
    user: userId,
    bankName,
    bankNumber,
    userName,
  });

  return bankAccount;
};

/**
 * Query bank accounts
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryBankAccounts = async (filter, options) => {
  return BankAccount.paginate(filter, options);
};

/**
 * Get bank account by id
 * @param {ObjectId} id
 * @returns {Promise<BankAccount>}
 */
const getBankAccountById = async (id) => {
  return BankAccount.findById(id);
};

/**
 * Get bank account by user id
 * @param {ObjectId} userId
 * @returns {Promise<BankAccount>}
 */
const getBankAccountByUserId = async (userId) => {
  return BankAccount.findOne({ user: userId });
};

/**
 * Update bank account by id
 * @param {ObjectId} bankAccountId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<BankAccount>}
 */
const updateBankAccountById = async (bankAccountId, userId, updateBody) => {
  const bankAccount = await getBankAccountById(bankAccountId);
  if (!bankAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');
  }

  if (bankAccount.user.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  Object.assign(bankAccount, updateBody);
  await bankAccount.save();
  return bankAccount;
};

/**
 * Delete bank account by id
 * @param {ObjectId} bankAccountId
 * @param {ObjectId} userId
 * @returns {Promise<BankAccount>}
 */
const deleteBankAccountById = async (bankAccountId, userId) => {
  const bankAccount = await getBankAccountById(bankAccountId);
  if (!bankAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');
  }

  if (bankAccount.user.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  await bankAccount.deleteOne();
  return bankAccount;
};

module.exports = {
  createBankAccount,
  queryBankAccounts,
  getBankAccountById,
  getBankAccountByUserId,
  updateBankAccountById,
  deleteBankAccountById,
};
