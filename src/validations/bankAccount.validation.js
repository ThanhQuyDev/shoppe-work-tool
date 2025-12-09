const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBankAccount = {
  body: Joi.object().keys({
    bankName: Joi.string().required().trim(),
    bankNumber: Joi.string().required().trim(),
    userName: Joi.string().required().trim(),
  }),
};

const getBankAccounts = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    bankName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBankAccount = {
  params: Joi.object().keys({
    bankAccountId: Joi.string().required().custom(objectId),
  }),
};

const updateBankAccount = {
  params: Joi.object().keys({
    bankAccountId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      bankName: Joi.string().trim(),
      bankNumber: Joi.string().trim(),
      userName: Joi.string().trim(),
    })
    .min(1),
};

const deleteBankAccount = {
  params: Joi.object().keys({
    bankAccountId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createBankAccount,
  getBankAccounts,
  getBankAccount,
  updateBankAccount,
  deleteBankAccount,
};
