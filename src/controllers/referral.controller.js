const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { referralService } = require('../services');

const getReferralStats = catchAsync(async (req, res) => {
  const stats = await referralService.getReferralStats(req.user.id);
  res.send(stats);
});

const getReferralTree = catchAsync(async (req, res) => {
  const maxDepth = parseInt(req.query.maxDepth, 10) || 3;
  const tree = await referralService.getReferralTree(req.user.id, maxDepth);
  res.send({ tree });
});

module.exports = {
  getReferralStats,
  getReferralTree,
};

