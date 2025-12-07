const Joi = require('joi');
const { objectId } = require('./custom.validation');

const registerSaving = {
  body: Joi.object().keys({
    interestRateId: Joi.string().required().custom(objectId),
    amount: Joi.number().required().min(1),
  }),
};

const getSavings = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSaving = {
  params: Joi.object().keys({
    savingId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  registerSaving,
  getSavings,
  getSaving,
};
