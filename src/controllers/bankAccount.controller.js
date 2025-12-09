const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bankAccountService } = require('../services');

const createBankAccount = catchAsync(async (req, res) => {
  const bankAccount = await bankAccountService.createBankAccount(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(bankAccount);
});

const getBankAccounts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'bankName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Non-admin users can only see their own bank account
  if (req.user.role !== 'admin') {
    filter.user = req.user.id;
  }

  const result = await bankAccountService.queryBankAccounts(filter, options);
  res.send(result);
});

const getBankAccount = catchAsync(async (req, res) => {
  const bankAccount = await bankAccountService.getBankAccountById(req.params.bankAccountId);
  if (!bankAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');
  }

  // Non-admin users can only see their own bank account
  if (req.user.role !== 'admin' && bankAccount.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.send(bankAccount);
});

const getMyBankAccount = catchAsync(async (req, res) => {
  const bankAccount = await bankAccountService.getBankAccountByUserId(req.user.id);
  if (!bankAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');
  }
  res.send(bankAccount);
});

const updateBankAccount = catchAsync(async (req, res) => {
  const bankAccount = await bankAccountService.updateBankAccountById(req.params.bankAccountId, req.user.id, req.body);
  res.send(bankAccount);
});

const deleteBankAccount = catchAsync(async (req, res) => {
  await bankAccountService.deleteBankAccountById(req.params.bankAccountId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBankAccount,
  getBankAccounts,
  getBankAccount,
  getMyBankAccount,
  updateBankAccount,
  deleteBankAccount,
};
