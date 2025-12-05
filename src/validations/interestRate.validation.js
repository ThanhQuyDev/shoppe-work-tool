const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createInterestRate = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    duration: Joi.string().required(),
    durationAmount: Joi.number().required().min(1),
    rate: Joi.number().required().min(0),
    minAmount: Joi.number().required().min(0),
    description: Joi.string().allow(''),
    img: Joi.string().allow(''),
  }),
};

const getInterestRates = {
  query: Joi.object().keys({
    name: Joi.string(),
    duration: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInterestRate = {
  params: Joi.object().keys({
    interestRateId: Joi.string().custom(objectId),
  }),
};

const updateInterestRate = {
  params: Joi.object().keys({
    interestRateId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      duration: Joi.string(),
      durationAmount: Joi.number().min(1),
      rate: Joi.number().min(0),
      minAmount: Joi.number().min(0),
      description: Joi.string().allow(''),
      img: Joi.string().allow(''),
    })
    .min(1),
};

const deleteInterestRate = {
  params: Joi.object().keys({
    interestRateId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createInterestRate,
  getInterestRates,
  getInterestRate,
  updateInterestRate,
  deleteInterestRate,
};

