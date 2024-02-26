const Joi = require('joi');

const organisationSignupValidation = Joi.object().keys({
  org_name: Joi.string().min(2).max(30).required(),
  username: Joi.string().min(2).max(20).required(),
  password:Joi.string().regex(/^[a-zA-Z0-9]{7,30}$/).required(),
  email: Joi.string().email().required(),
});

const signInValidtionSchema = Joi.object().keys({
  org_name: Joi.string().min(2).max(30).required(),
  username: Joi.string().min(2).max(20).required(),
  password:Joi.string().regex(/^[a-zA-Z0-9]{7,30}$/).required(),
});

exports.organisationSignupValidation = organisationSignupValidation;
exports.signInValidtionSchema = signInValidtionSchema;
