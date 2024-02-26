const utils = require('../utils/utils');
const Schema = require('./auth.validator.schema');

const validateOrganisationSignup = async (req, res, next) => {
  const data = req.body;
  await utils.joiValidate(data, Schema.organisationSignupValidation);
  return next();
};

const validateSignIn = async (req, res, next) => {
  const data = req.body;
  await utils.joiValidate(data, Schema.signInValidtionSchema);
  return next();
};

exports.validateOrganisationSignup = validateOrganisationSignup;
exports.validateSignIn = validateSignIn;