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
    img: Joi.string().allow('').custom((value, helpers) => {
      // Cho phép URL hoặc base64 string
      if (!value) return value;
      if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')) {
        return value;
      }
      // Nếu là base64 thuần, thêm prefix
      if (value.match(/^[A-Za-z0-9+/=]+$/)) {
        return `data:image/png;base64,${value}`;
      }
      return value;
    }),
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
      img: Joi.string().allow('').custom((value, helpers) => {
        // Cho phép URL hoặc base64 string
        if (!value) return value;
        if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')) {
          return value;
        }
        // Nếu là base64 thuần, thêm prefix
        if (value.match(/^[A-Za-z0-9+/=]+$/)) {
          return `data:image/png;base64,${value}`;
        }
        return value;
      }),
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
