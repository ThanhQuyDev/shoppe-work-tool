const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createGiftExchange = {
  body: Joi.object().keys({
    giftId: Joi.string().required().custom(objectId),
  }),
};

const getGiftExchanges = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAllGiftExchanges = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGiftExchange = {
  params: Joi.object().keys({
    giftExchangeId: Joi.string().required().custom(objectId),
  }),
};

const approveGiftExchange = {
  params: Joi.object().keys({
    giftExchangeId: Joi.string().required().custom(objectId),
  }),
};

const rejectGiftExchange = {
  params: Joi.object().keys({
    giftExchangeId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createGiftExchange,
  getGiftExchanges,
  getAllGiftExchanges,
  getGiftExchange,
  approveGiftExchange,
  rejectGiftExchange,
};

