const httpStatus = require('http-status');
const { InterestRate } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an interest rate
 * @param {Object} interestRateBody
 * @returns {Promise<InterestRate>}
 */
const createInterestRate = async (interestRateBody) => {
  return InterestRate.create(interestRateBody);
};

/**
 * Query for interest rates
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInterestRates = async (filter, options) => {
  const interestRates = await InterestRate.paginate(filter, options);
  return interestRates;
};

/**
 * Get interest rate by id
 * @param {ObjectId} id
 * @returns {Promise<InterestRate>}
 */
const getInterestRateById = async (id) => {
  return InterestRate.findById(id);
};

/**
 * Update interest rate by id
 * @param {ObjectId} interestRateId
 * @param {Object} updateBody
 * @returns {Promise<InterestRate>}
 */
const updateInterestRateById = async (interestRateId, updateBody) => {
  const interestRate = await getInterestRateById(interestRateId);
  if (!interestRate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interest rate not found');
  }
  Object.assign(interestRate, updateBody);
  await interestRate.save();
  return interestRate;
};

/**
 * Delete interest rate by id
 * @param {ObjectId} interestRateId
 * @returns {Promise<InterestRate>}
 */
const deleteInterestRateById = async (interestRateId) => {
  const interestRate = await getInterestRateById(interestRateId);
  if (!interestRate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interest rate not found');
  }
  await interestRate.remove();
  return interestRate;
};

module.exports = {
  createInterestRate,
  queryInterestRates,
  getInterestRateById,
  updateInterestRateById,
  deleteInterestRateById,
};
