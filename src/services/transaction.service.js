const httpStatus = require('http-status');
const { Transaction, User, BankAccount } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a transaction (deposit or withdraw)
 * @param {ObjectId} userId
 * @param {Object} transactionBody
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (userId, transactionBody) => {
  const { type, amount } = transactionBody;

  const [user, bankAccount] = await Promise.all([
    User.findById(userId),
    BankAccount.findOne({ user: userId }),
  ]);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Kiểm tra user đã liên kết tài khoản ngân hàng chưa
  if (!bankAccount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please link your bank account first');
  }

  // Kiểm tra số dư khi rút tiền
  if (type === 'withdraw' && user.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  return Transaction.create({
    user: userId,
    type,
    amount,
    // Lấy thông tin ngân hàng từ bank account của user
    bankName: bankAccount.bankName,
    bankNumber: bankAccount.bankNumber,
    userName: bankAccount.userName,
    status: 'pending',
  });
};

/**
 * Query transactions
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryTransactions = async (filter, options) => {
  return Transaction.paginate(filter, options);
};

/**
 * Get transaction by id
 * @param {ObjectId} transactionId
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (transactionId) => {
  return Transaction.findById(transactionId);
};

/**
 * Approve a transaction
 * @param {ObjectId} transactionId
 * @param {ObjectId} adminId
 * @returns {Promise<Transaction>}
 */
const approveTransaction = async (transactionId, adminId) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  if (transaction.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction is not pending');
  }

  const user = await User.findById(transaction.user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Cập nhật số dư
  if (transaction.type === 'deposit') {
    user.balance += transaction.amount;
  } else if (transaction.type === 'withdraw') {
    if (user.balance < transaction.amount) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }
    user.balance -= transaction.amount;
  }

  await user.save();

  // Cập nhật transaction
  transaction.status = 'approved';
  transaction.approvedBy = adminId;
  transaction.approvedAt = new Date();
  await transaction.save();

  return transaction;
};

/**
 * Reject a transaction
 * @param {ObjectId} transactionId
 * @param {ObjectId} adminId
 * @returns {Promise<Transaction>}
 */
const rejectTransaction = async (transactionId, adminId) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  if (transaction.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction is not pending');
  }

  transaction.status = 'rejected';
  transaction.rejectedBy = adminId;
  transaction.rejectedAt = new Date();
  await transaction.save();

  return transaction;
};

module.exports = {
  createTransaction,
  queryTransactions,
  getTransactionById,
  approveTransaction,
  rejectTransaction,
};
