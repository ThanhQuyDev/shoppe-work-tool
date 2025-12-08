const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTransaction = {
  body: Joi.object().keys({
    type: Joi.string().required().valid('deposit', 'withdraw'),
    amount: Joi.number().required().min(0),
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
  }),
};

const getTransactions = {
  query: Joi.object().keys({
    type: Joi.string().valid('deposit', 'withdraw'),
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

const approveTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

const rejectTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  approveTransaction,
  rejectTransaction,
};

