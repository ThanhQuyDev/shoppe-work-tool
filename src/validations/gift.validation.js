const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createGift = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().trim().allow(''),
    pointsRequired: Joi.number().integer().min(0).required(),
    isActive: Joi.boolean().default(true),
    img: Joi.string().trim().allow(''),
  }),
};

const getGifts = {
  query: Joi.object().keys({
    name: Joi.string(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getGift = {
  params: Joi.object().keys({
    giftId: Joi.string().required().custom(objectId),
  }),
};

const updateGift = {
  params: Joi.object().keys({
    giftId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      description: Joi.string().trim().allow(''),
      pointsRequired: Joi.number().integer().min(0),
      isActive: Joi.boolean(),
      img: Joi.string().trim().allow(''),
    })
    .min(1),
};

const deleteGift = {
  params: Joi.object().keys({
    giftId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createGift,
  getGifts,
  getGift,
  updateGift,
  deleteGift,
};

