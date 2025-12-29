const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getStocks = {
  query: Joi.object().keys({
    name: Joi.string(),
    symbol: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getStock = {
  params: Joi.object().keys({
    stockId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getStocks,
  getStock,
};

