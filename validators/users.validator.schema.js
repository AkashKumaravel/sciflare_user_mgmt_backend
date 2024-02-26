const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const addNewUserValidateSchema = Joi.object().keys({
  first_name: Joi.string().min(2).max(20).required(),
  last_name: Joi.string().min(2).max(20),
  user_type: Joi.number().valid(1,2).required(),
  username: Joi.string().min(2).max(20).required(),
  password:Joi.string().regex(/^[a-zA-Z0-9]{7,30}$/).required(),
  email: Joi.string().email().required(),
  role: Joi.string(),
});

const updateUserValidateSchema = Joi.object().keys({
  _id: Joi.objectId().required(),
  first_name: Joi.string().min(2).max(20).required(),
  last_name: Joi.string().min(2).max(20).allow(''),
  role: Joi.string(),
  password:Joi.string().regex(/^[a-zA-Z0-9]{7,30}$/),
});

const getUserValidateSchema = Joi.object().keys({
  _id: Joi.objectId(),
});

const deleteUserValidateSchema = Joi.object().keys({
  _id: Joi.objectId().required(),
});

exports.addNewUserValidateSchema = addNewUserValidateSchema;
exports.updateUserValidateSchema = updateUserValidateSchema;
exports.getUserValidateSchema = getUserValidateSchema;
exports.deleteUserValidateSchema = deleteUserValidateSchema;