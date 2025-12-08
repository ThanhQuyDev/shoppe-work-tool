const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');

const createTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(transaction);
});

const getTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'status', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // User chỉ xem được transaction của mình
  if (req.user.role !== 'admin') {
    filter.user = req.user.id;
  }
  const result = await transactionService.queryTransactions(filter, options);
  res.send(result);
});

const getTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  // User chỉ xem được transaction của mình
  if (req.user.role !== 'admin' && transaction.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.send(transaction);
});

const approveTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.approveTransaction(req.params.transactionId, req.user.id);
  res.send(transaction);
});

const rejectTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.rejectTransaction(req.params.transactionId, req.user.id);
  res.send(transaction);
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  approveTransaction,
  rejectTransaction,
};

