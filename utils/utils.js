const _ = require('lodash');
const jwt = require('jsonwebtoken');
const mongo = require('mongodb');
const { DATABASE_NAME } = require('./constants');
const bcrypt = require("bcrypt")

const pick = (data, values) => _.pick(data, values);

const omit = (data, values) => _.omit(data, values);

const isEmpty = (data) => (_.isEmpty(data) ? !mongo.ObjectId.isValid(data) : false);

const hasProperty = (obj, attribute) => Object.prototype.hasOwnProperty.call(obj, attribute);

const compareObjectId = (value1, value2) => _.isEqual(value1, value2);

const generateObjectId = (mongoIds) => {
  if (Array.isArray(mongoIds)) { return mongoIds.map((item) => new mongo.ObjectId(item)); }
  return new mongo.ObjectId(mongoIds);
};

const hashPassword = async (password) => {
  const saltRounds = 10
  const result = await bcrypt.hash(password, saltRounds);
  return result;
};

const comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
}

const joiValidate = async (data, scheme) => {
  const dataSet = data || {};
  const { error } = await scheme.validate(dataSet, { abortEarly: false });
  if (error) throw error;
  return error;
};

const errorHandler = (err, res) => {
  const errorName = err.name || '';
  switch (errorName) {
    case 'ValidationError':
      res.status(422).json({ success: false, error: err.details })
      break
    case 'AuthorizationError':
      res.status(401).json({ success: false, error: err.message })
      break
    case 'Error':
      res.status(404).json({success: false, error: err.message })
      break
    case 'MongoParseError':
      res.status(422).json({ success: false, error: 'Mongodb Connection Error' })
      break
    default:
      res.status(500).json({ success: false, error: 'Something Went Wrong' })
      break
  }
};

const getDbConnection = async (collection) => {
  const DB_URL = process.env.DATABASE_CONNECTION_STRING || 'mongodb://localhost:27017';
  const client = await mongo.MongoClient.connect(DB_URL);
  if (client) {
    const db = client.db(DATABASE_NAME)
    return db.collection(collection)
  }
  throw new Error('Mongo Connection Error')
};

const generateJwtToken = async (userDetails) => {
  const tokenPayload = {
    user_id: userDetails['_id'],
    account_id: userDetails['account_id'],
    email: userDetails['email'],
  };
  const privateKey = process.env.JWT_SECRET_KEY || ''
  const token = await jwt.sign(tokenPayload, privateKey);
  return token;
};

exports.pick = pick;
exports.joiValidate = joiValidate;
exports.errorHandler = errorHandler;
exports.getDbConnection = getDbConnection;
exports.isEmpty = isEmpty;
exports.generateObjectId = generateObjectId;
exports.hasProperty = hasProperty;
exports.omit = omit;
exports.compareObjectId = compareObjectId;
exports.generateJwtToken = generateJwtToken;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
