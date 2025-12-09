const Joi = require('joi');

const createSystemBankAccount = {
  body: Joi.object().keys({
    bankName: Joi.string().required().trim(),
    bankNumber: Joi.string().required().trim(),
    userName: Joi.string().required().trim(),
  }),
};

const updateSystemBankAccount = {
  body: Joi.object()
    .keys({
      bankName: Joi.string().trim(),
      bankNumber: Joi.string().trim(),
      userName: Joi.string().trim(),
    })
    .min(1),
};

module.exports = {
  createSystemBankAccount,
  updateSystemBankAccount,
};

