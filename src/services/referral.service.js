const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Calculate referral points based on level
 * @param {number} level - Level in referral tree (1 = direct referrer, 2 = grandparent, etc.)
 * @returns {number} Points to award
 */
const getReferralPoints = (level) => {
  if (level === 1) return 1.0;
  if (level === 2) return 0.5;
  if (level === 3) return 0.2;
  if (level >= 4) return 0.1;
  return 0;
};

/**
 * Get referral chain (ancestors) for a user
 * @param {ObjectId} userId - User ID
 * @param {number} maxLevel - Maximum level to traverse (default: 10)
 * @returns {Promise<Array>} Array of user IDs in referral chain (from direct referrer to root)
 */
const getReferralChain = async (userId, maxLevel = 10) => {
  const chain = [];
  let currentUserId = userId;
  let level = 0;

  while (level < maxLevel) {
    const user = await User.findById(currentUserId).select('referredBy');
    if (!user || !user.referredBy) {
      break;
    }
    chain.push(user.referredBy);
    currentUserId = user.referredBy;
    level++;
  }

  return chain;
};

/**
 * Activate user account and award referral points to referral chain
 * @param {ObjectId} userId - User ID that is being activated
 * @returns {Promise<void>}
 */
const activateUserAndAwardReferralPoints = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if user is already activated
  if (user.isActivated) {
    return; // Already activated, skip
  }

  // Mark user as activated
  user.isActivated = true;
  await user.save();

  // Get referral chain
  const referralChain = await getReferralChain(userId);

  if (referralChain.length === 0) {
    return; // No referral chain, nothing to award
  }

  // Award points to each level in the referral chain
  const updatePromises = referralChain.map(async (referrerId, index) => {
    const level = index + 1; // Level 1 = direct referrer, Level 2 = grandparent, etc.
    const pointsToAward = getReferralPoints(level);

    if (pointsToAward > 0) {
      await User.findByIdAndUpdate(referrerId, {
        $inc: { points: pointsToAward },
      });
    }
  });

  await Promise.all(updatePromises);
};

/**
 * Get referral statistics for a user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Object>} Referral statistics
 */
const getReferralStats = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Count direct referrals
  const directReferrals = await User.countDocuments({ referredBy: userId });

  // Count activated direct referrals
  const activatedDirectReferrals = await User.countDocuments({
    referredBy: userId,
    isActivated: true,
  });

  // Get total points earned from referrals
  const totalPointsEarned = user.points || 0;

  return {
    directReferrals,
    activatedDirectReferrals,
    totalPointsEarned,
    isActivated: user.isActivated,
  };
};

/**
 * Get referral tree (downline) for a user
 * @param {ObjectId} userId - User ID
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Promise<Array>} Referral tree
 */
const getReferralTree = async (userId, maxDepth = 3) => {
  const buildTree = async (parentId, currentDepth) => {
    if (currentDepth > maxDepth) {
      return [];
    }

    const referrals = await User.find({ referredBy: parentId })
      .select('name email isActivated points createdAt')
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent too much data

    const tree = await Promise.all(
      referrals.map(async (referral) => {
        const children = await buildTree(referral._id, currentDepth + 1);
        return {
          id: referral._id,
          name: referral.name,
          email: referral.email,
          isActivated: referral.isActivated,
          points: referral.points,
          createdAt: referral.createdAt,
          children,
        };
      })
    );

    return tree;
  };

  return buildTree(userId, 0);
};

module.exports = {
  activateUserAndAwardReferralPoints,
  getReferralStats,
  getReferralTree,
  getReferralChain,
  getReferralPoints,
};

