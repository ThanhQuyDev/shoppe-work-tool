const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    symbol: Joi.string().required().uppercase().trim(),
    amount: Joi.number().required().min(0.00000001),
    type: Joi.string().required().valid('buy', 'sell'),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    symbol: Joi.string().uppercase(),
    type: Joi.string().valid('buy', 'sell'),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
};

