const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCustomCoin = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    symbol: Joi.string().required().trim().uppercase(),
    binanceSymbol: Joi.string().required().trim().uppercase(),
    description: Joi.string().trim().allow(''),
    img: Joi.string().trim().allow(''),
    isActive: Joi.boolean().default(true),
  }),
};

const getCustomCoins = {
  query: Joi.object().keys({
    name: Joi.string(),
    symbol: Joi.string(),
    binanceSymbol: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCustomCoin = {
  params: Joi.object().keys({
    coinId: Joi.string().required().custom(objectId),
  }),
};

const updateCustomCoin = {
  params: Joi.object().keys({
    coinId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      symbol: Joi.string().trim().uppercase(),
      binanceSymbol: Joi.string().trim().uppercase(),
      description: Joi.string().trim().allow(''),
      img: Joi.string().trim().allow(''),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteCustomCoin = {
  params: Joi.object().keys({
    coinId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createCustomCoin,
  getCustomCoins,
  getCustomCoin,
  updateCustomCoin,
  deleteCustomCoin,
};

