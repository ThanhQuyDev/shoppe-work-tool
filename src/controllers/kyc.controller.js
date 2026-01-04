const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { kycService } = require('../services');

const createOrUpdateKYC = catchAsync(async (req, res) => {
  const kyc = await kycService.createOrUpdateKYC(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(kyc);
});

const getKYC = catchAsync(async (req, res) => {
  const kyc = await kycService.getKYCByUserId(req.user.id);
  if (!kyc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'KYC not found');
  }
  res.send(kyc);
});

const getAllKYCs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await kycService.queryAllKYCsWithUser(filter, options);
  res.send(result);
});

const getKYCById = catchAsync(async (req, res) => {
  const kyc = await kycService.getKYCById(req.params.kycId);
  if (!kyc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'KYC not found');
  }
  // User chỉ xem được KYC của mình
  if (req.user.role !== 'admin' && kyc.user._id.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  res.send(kyc);
});

const approveKYC = catchAsync(async (req, res) => {
  const kyc = await kycService.approveKYC(req.params.kycId, req.user.id);
  res.send(kyc);
});

const rejectKYC = catchAsync(async (req, res) => {
  const kyc = await kycService.rejectKYC(req.params.kycId, req.user.id, req.body.rejectionReason);
  res.send(kyc);
});

module.exports = {
  createOrUpdateKYC,
  getKYC,
  getAllKYCs,
  getKYCById,
  approveKYC,
  rejectKYC,
};

