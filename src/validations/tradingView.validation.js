const Joi = require('joi');

const getKlines = {
  query: Joi.object().keys({
    symbol: Joi.string().required().uppercase(),
    interval: Joi.string()
      .valid('1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M')
      .default('1h'),
    limit: Joi.number().integer().min(1).max(1000).default(200),
  }),
};

const getKlinesDirect = {
  query: Joi.object().keys({
    symbol: Joi.string().default('BTCUSDT').uppercase(),
    interval: Joi.string()
      .valid('1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M')
      .default('1h'),
    limit: Joi.number().integer().min(1).max(1000).default(200),
  }),
};

module.exports = {
  getKlines,
  getKlinesDirect,
};
