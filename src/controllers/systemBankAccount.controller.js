const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { systemBankAccountService } = require('../services');

const createSystemBankAccount = catchAsync(async (req, res) => {
  const bankAccount = await systemBankAccountService.createSystemBankAccount(req.body);
  res.status(httpStatus.CREATED).send(bankAccount);
});

const getSystemBankAccount = catchAsync(async (req, res) => {
  const bankAccount = await systemBankAccountService.getSystemBankAccount();
  if (!bankAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'System bank account not found');
  }
  res.send(bankAccount);
});

const updateSystemBankAccount = catchAsync(async (req, res) => {
  const bankAccount = await systemBankAccountService.updateSystemBankAccount(req.body);
  res.send(bankAccount);
});

const deleteSystemBankAccount = catchAsync(async (req, res) => {
  await systemBankAccountService.deleteSystemBankAccount();
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSystemBankAccount,
  getSystemBankAccount,
  updateSystemBankAccount,
  deleteSystemBankAccount,
};

