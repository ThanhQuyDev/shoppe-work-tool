const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { interestRateService } = require('../services');

const createInterestRate = catchAsync(async (req, res) => {
  const interestRate = await interestRateService.createInterestRate(req.body);
  res.status(httpStatus.CREATED).send(interestRate);
});

const getInterestRates = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'duration']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await interestRateService.queryInterestRates(filter, options);
  res.send(result);
});

const getInterestRate = catchAsync(async (req, res) => {
  const interestRate = await interestRateService.getInterestRateById(req.params.interestRateId);
  if (!interestRate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interest rate not found');
  }
  res.send(interestRate);
});

const updateInterestRate = catchAsync(async (req, res) => {
  const interestRate = await interestRateService.updateInterestRateById(req.params.interestRateId, req.body);
  res.send(interestRate);
});

const deleteInterestRate = catchAsync(async (req, res) => {
  await interestRateService.deleteInterestRateById(req.params.interestRateId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInterestRate,
  getInterestRates,
  getInterestRate,
  updateInterestRate,
  deleteInterestRate,
};
