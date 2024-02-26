const utils = require('../utils/utils');
const Schema = require('./users.validator.schema');

const validateAddUser = async (req, res, next) => {
  const data = req.body;
  await utils.joiValidate(data, Schema.addNewUserValidateSchema);
  return next();
};

const validateUpdateUser = async (req, res, next) => {
  const data = req.body;
  await utils.joiValidate(data, Schema.updateUserValidateSchema);
  return next();
};

const validateGetUser = async (req, res, next) => {
  const data = req.query;
  await utils.joiValidate(data, Schema.getUserValidateSchema);
  return next();
};

const validateDeleteUser = async (req, res, next) => {
  const data = req.params;
  await utils.joiValidate(data, Schema.deleteUserValidateSchema);
  return next();
};

exports.validateAddUser = validateAddUser;
exports.validateUpdateUser = validateUpdateUser;
exports.validateGetUser = validateGetUser;
exports.validateDeleteUser = validateDeleteUser;
