const utils = require('../utils/utils');
const Schema = require('./organisation.validator.schema');

const validateUpdateOrgDetails = async (req, res, next) => {
  const data = req.body;
  await utils.joiValidate(data, Schema.updateOrgDetailsValidationSchema);
  return next();
};

const validateDeleteOrganisation = async (req, res, next) => {
  const data = req.params;
  await utils.joiValidate(data, Schema.deleteOrganisationValidationSchema);
  return next();
};

const validateGetOrganisation = async (req, res, next) => {
  const data = req.params;
  await utils.joiValidate(data, Schema.getOrganisationValidationSchema);
  return next();
};

exports.validateUpdateOrgDetails = validateUpdateOrgDetails;
exports.validateDeleteOrganisation = validateDeleteOrganisation;
exports.validateGetOrganisation = validateGetOrganisation;
