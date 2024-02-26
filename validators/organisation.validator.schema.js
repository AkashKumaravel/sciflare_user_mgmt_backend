const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const updateOrgDetailsValidationSchema = Joi.object().keys({
  _id: Joi.objectId().required(),
  description: Joi.string().max(1000),
  address: Joi.string().max(1000),
  country: Joi.string(),
  timezone: Joi.string(),
  industry: Joi.string(),
});

const deleteOrganisationValidationSchema = Joi.object().keys({
  _id: Joi.objectId().required(),
});

const getOrganisationValidationSchema = Joi.object().keys({
  _id: Joi.objectId().required(),
});

exports.updateOrgDetailsValidationSchema = updateOrgDetailsValidationSchema;
exports.deleteOrganisationValidationSchema = deleteOrganisationValidationSchema;
exports.getOrganisationValidationSchema = getOrganisationValidationSchema;
