const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrUpdateKYC = {
  body: Joi.object().keys({
    documentType: Joi.string().valid('cccd', 'passport').required(),
    documentNumber: Joi.string().required().trim(),
    fullName: Joi.string().required().trim(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    nationality: Joi.string().trim().default('Vietnam'),
    permanentAddress: Joi.string().required().trim(),
    frontImage: Joi.string().required().trim(),
    backImage: Joi.string().required().trim(),
    portraitImage: Joi.string().required().trim(),
  }),
};

const getKYCs = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getKYC = {
  params: Joi.object().keys({
    kycId: Joi.string().required().custom(objectId),
  }),
};

const approveKYC = {
  params: Joi.object().keys({
    kycId: Joi.string().required().custom(objectId),
  }),
};

const rejectKYC = {
  params: Joi.object().keys({
    kycId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    rejectionReason: Joi.string().trim().allow(''),
  }),
};

module.exports = {
  createOrUpdateKYC,
  getKYCs,
  getKYC,
  approveKYC,
  rejectKYC,
};

