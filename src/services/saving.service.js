const httpStatus = require('http-status');
const { Saving, InterestRate, User } = require('../models');
const ApiError = require('../utils/ApiError');

const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Register a saving package for a user
 * @param {ObjectId} userId
 * @param {{interestRateId: string, amount: number}} payload
 * @returns {Promise<Saving>}
 */
const registerSaving = async (userId, payload) => {
  const { interestRateId, amount } = payload;
  const [user, interestRate] = await Promise.all([User.findById(userId), InterestRate.findById(interestRateId)]);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!interestRate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interest rate not found');
  }

  if (amount < interestRate.minAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Amount is lower than minimum requirement');
  }
  if (user.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  if (!interestRate.durationAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid interest rate duration');
  }

  const termMonths = interestRate.durationAmount;
  const startDate = new Date();
  const maturityDate = addMonths(startDate, termMonths);

  const saving = await Saving.create({
    user: userId,
    interestRate: interestRate.id,
    interestRateSnapshot: {
      name: interestRate.name,
      duration: interestRate.duration,
      durationAmount: interestRate.durationAmount,
      rate: interestRate.rate,
      minAmount: interestRate.minAmount,
    },
    amount,
    termMonths,
    startDate,
    maturityDate,
  });

  user.balance -= amount;
  await user.save();

  return saving;
};

/**
 * Query savings
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const querySavings = async (filter, options) => {
  return Saving.paginate(filter, options);
};

/**
 * Get saving by id
 * @param {ObjectId} savingId
 * @returns {Promise<Saving>}
 */
const getSavingById = async (savingId) => {
  return Saving.findById(savingId);
};

module.exports = {
  registerSaving,
  querySavings,
  getSavingById,
};
