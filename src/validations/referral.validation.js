const Joi = require('joi');

const getReferralTree = {
  query: Joi.object().keys({
    maxDepth: Joi.number().integer().min(1).max(10).default(3),
  }),
};

module.exports = {
  getReferralTree,
};

