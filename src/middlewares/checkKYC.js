const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

/**
 * Middleware to check if user has approved KYC
 */
const checkKYC = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'User not found'));
  }

  if (user.kycStatus !== 'approved') {
    return next(
      new ApiError(
        httpStatus.FORBIDDEN,
        'KYC verification is required. Please complete KYC verification before proceeding.'
      )
    );
  }

  next();
};

module.exports = checkKYC;

