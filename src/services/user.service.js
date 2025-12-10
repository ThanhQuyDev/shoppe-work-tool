const httpStatus = require('http-status');
const { User, BankAccount } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users with bank account info
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);

  // Lấy thông tin bank account cho từng user
  const userIds = users.results.map((user) => user.id);
  const bankAccounts = await BankAccount.find({ user: { $in: userIds } });

  // Map bank account theo user id
  const bankAccountMap = {};
  bankAccounts.forEach((account) => {
    bankAccountMap[account.user.toString()] = account;
  });

  // Thêm bank account vào từng user
  users.results = users.results.map((user) => {
    const userObj = user.toJSON();
    userObj.bankAccount = bankAccountMap[user.id] || null;
    return userObj;
  });

  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by id with bank account
 * @param {ObjectId} id
 * @returns {Promise<Object>}
 */
const getUserByIdWithBankAccount = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    return null;
  }

  const bankAccount = await BankAccount.findOne({ user: id });
  const userObj = user.toJSON();
  userObj.bankAccount = bankAccount || null;

  return userObj;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByIdWithBankAccount,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
