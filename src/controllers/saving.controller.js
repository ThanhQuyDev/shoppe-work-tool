const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { savingService } = require('../services');

const registerSaving = catchAsync(async (req, res) => {
  const saving = await savingService.registerSaving(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(saving);
});

const getSavings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  let result;
  if (req.user.role === 'admin') {
    // Admin: lấy tất cả savings kèm thông tin user
    result = await savingService.querySavingsWithUser(filter, options);
  } else {
    // User: chỉ lấy savings của mình
    filter.user = req.user.id;
    result = await savingService.querySavings(filter, options);
  }
  res.send(result);
});

const getSaving = catchAsync(async (req, res) => {
  const saving = await savingService.getSavingById(req.params.savingId);
  if (!saving) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Saving not found');
  }
  if (req.user.role !== 'admin' && saving.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.send(saving);
});

module.exports = {
  registerSaving,
  getSavings,
  getSaving,
};
