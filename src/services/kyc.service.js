const httpStatus = require('http-status');
const { KYC, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create or update KYC submission
 * @param {ObjectId} userId
 * @param {Object} kycBody
 * @returns {Promise<KYC>}
 */
const createOrUpdateKYC = async (userId, kycBody) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if KYC already exists
  let kyc = await KYC.findOne({ user: userId });

  if (kyc) {
    // If KYC is already approved, don't allow update
    if (kyc.status === 'approved') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'KYC is already approved and cannot be updated');
    }
    // Update existing KYC
    Object.assign(kyc, {
      ...kycBody,
      status: 'pending', // Reset to pending when updated
    });
    await kyc.save();
  } else {
    // Create new KYC
    kyc = await KYC.create({
      user: userId,
      ...kycBody,
      status: 'pending',
    });
  }

  // Update user KYC status
  user.kycStatus = 'pending';
  await user.save();

  return kyc;
};

/**
 * Query KYC submissions
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryKYCs = async (filter, options) => {
  return KYC.paginate(filter, options);
};

/**
 * Query all KYC submissions with user info (for admin)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryAllKYCsWithUser = async (filter, options) => {
  const optionsWithPopulate = {
    ...options,
    populate: 'user',
  };
  return KYC.paginate(filter, optionsWithPopulate);
};

/**
 * Get KYC by user id
 * @param {ObjectId} userId
 * @returns {Promise<KYC>}
 */
const getKYCByUserId = async (userId) => {
  return KYC.findOne({ user: userId }).populate('user');
};

/**
 * Get KYC by id
 * @param {ObjectId} kycId
 * @returns {Promise<KYC>}
 */
const getKYCById = async (kycId) => {
  return KYC.findById(kycId).populate('user');
};

/**
 * Approve KYC
 * @param {ObjectId} kycId
 * @param {ObjectId} adminId
 * @returns {Promise<KYC>}
 */
const approveKYC = async (kycId, adminId) => {
  const kyc = await getKYCById(kycId);
  if (!kyc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'KYC not found');
  }

  if (kyc.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'KYC is not pending');
  }

  // Update KYC status
  kyc.status = 'approved';
  kyc.approvedBy = adminId;
  kyc.approvedAt = new Date();
  await kyc.save();

  // Update user KYC status
  const user = await User.findById(kyc.user);
  if (user) {
    user.kycStatus = 'approved';
    await user.save();
  }

  return kyc;
};

/**
 * Reject KYC
 * @param {ObjectId} kycId
 * @param {ObjectId} adminId
 * @param {string} rejectionReason
 * @returns {Promise<KYC>}
 */
const rejectKYC = async (kycId, adminId, rejectionReason) => {
  const kyc = await getKYCById(kycId);
  if (!kyc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'KYC not found');
  }

  if (kyc.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'KYC is not pending');
  }

  // Update KYC status
  kyc.status = 'rejected';
  kyc.rejectedBy = adminId;
  kyc.rejectedAt = new Date();
  kyc.rejectionReason = rejectionReason || '';
  await kyc.save();

  // Update user KYC status
  const user = await User.findById(kyc.user);
  if (user) {
    user.kycStatus = 'rejected';
    await user.save();
  }

  return kyc;
};

module.exports = {
  createOrUpdateKYC,
  queryKYCs,
  queryAllKYCsWithUser,
  getKYCByUserId,
  getKYCById,
  approveKYC,
  rejectKYC,
};

