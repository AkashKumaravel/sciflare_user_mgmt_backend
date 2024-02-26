const utils = require('../utils/utils');
const constants = require('../utils/constants');
const ValidationError = require('../utils/errors/ValidationError');
const AuthorizationError = require('../utils/errors/AuthorizationError');

const addNewUserService = async (req, res) => {
  const userDb = await utils.getDbConnection(constants.COLLECTION_NAME_USERS);
  const data = req.body;
  const actionerInfo = req[constants.REQ_ACTIONER_INFO];
  const accountId = actionerInfo['account_id'];
  const query = { account_id: accountId, $or: [{ username: data.username } , { email: data.email }] }
  let userDetails = await userDb.find(query).project({ password: 0 }).limit(1);
  userDetails = (await userDetails.toArray()).map((resultItem) => resultItem)[0];

  if (!utils.isEmpty(userDetails)) {
    if (userDetails.username === data.username) throw new ValidationError('Username already exists')
    if (userDetails.email === data.email) throw new ValidationError('Email already exists')
  }

  const inputData = {
    account_id: accountId,
    password: await utils.hashPassword(data.password),
    last_updated_on: new Date(),
    last_updated_by: actionerInfo['_id'],
    ...utils.pick(data, ['first_name', 'last_name', 'username', 'email', 'role', 'user_type']),
  }

  try {
    await userDb.insertOne(inputData);
  } catch (er) {
    throw er
  }

  res.status(201).json({ success: true, message: 'User Added Successfully' });
};

const updateUserService = async (req, res) => {
  const userDb = await utils.getDbConnection(constants.COLLECTION_NAME_USERS);

  const data = req.body;
  const actionerInfo = req[constants.REQ_ACTIONER_INFO];
  const accountId = actionerInfo['account_id'];
  const _id = utils.generateObjectId(data['_id']);

  if (actionerInfo.user_type !== constants.USER_TYPE_ADMIN) {
    if (!utils.compareObjectId(actionerInfo['_id'], _id)) throw new AuthorizationError();
  }

  const query = { _id, account_id: accountId };

  let userDetails = await userDb.find(query).limit(1);
  userDetails = (await userDetails.toArray()).map((resultItem) => resultItem)[0];

  if (utils.isEmpty(userDetails)) throw new ValidationError('User not Exist');

  const updatedInput = utils.pick(data, ['first_name', 'last_name', 'role', 'password']);
  if (utils.isEmpty(updatedInput)) throw new ValidationError('Provide Input to update');

  updatedInput['last_updated_on'] = new Date();
  updatedInput['last_updated_by'] = actionerInfo['_id'];
  try {
    await userDb.updateOne(query, { $set: updatedInput });
  } catch (er) {
    throw er
  }

  res.status(200).json({ success: true, message: 'User Updated Successfully' });
};

const getUserService = async (req, res) => {
  const userDb = await utils.getDbConnection(constants.COLLECTION_NAME_USERS);

  const actionerInfo = req[constants.REQ_ACTIONER_INFO];

  const accountId = actionerInfo['account_id'];
  let query = { account_id: accountId };

  let _id = null;
  if (utils.hasProperty(req.query, '_id')) {
    _id = utils.generateObjectId(req.query['_id']);
    query['_id'] = _id;
  }

  if (actionerInfo.user_type !== constants.USER_TYPE_ADMIN) {
    if (utils.isEmpty(_id) || !utils.compareObjectId(actionerInfo['_id'], _id)) throw new AuthorizationError();
  }

  let userDetails = await userDb.find(query).project({ password: 0 });
  userDetails = (await userDetails.toArray()).map((resultItem) => resultItem);
  res.status(200).json({ success: true, data: userDetails });
};

const deleteUserService = async (req, res) => {
  const userDb = await utils.getDbConnection(constants.COLLECTION_NAME_USERS);

  const actionerInfo = req[constants.REQ_ACTIONER_INFO];
  const accountId = actionerInfo['account_id'];
  const data = req.params;

  const _id = utils.generateObjectId(data['_id']);
  if (actionerInfo.user_type !== constants.USER_TYPE_ADMIN) {
    if (!utils.compareObjectId(actionerInfo['_id'], _id)) throw new AuthorizationError();
  }

  let query = { account_id: accountId };

  let userDetails = await userDb.find(query).project({ password: 0 });
  userDetails = (await userDetails.toArray()).map((resultItem) => resultItem);

  const currentUser = userDetails.find((item) => utils.compareObjectId(item['_id'], _id));
  if (utils.isEmpty(currentUser)) throw new ValidationError('User Not Exist');

  // If deleted User is admin. Checking whether anyother admin is present in the organisation
  if (currentUser.user_type === 1) {
    const adminUser = userDetails.find((item) => item.user_type === 1 && !utils.compareObjectId(item['_id'], _id));
    if (utils.isEmpty(adminUser)) throw new ValidationError('Atleast One Admin User is required per Organisation');
  }

  try {
    // Deleting the User
    query['_id'] = _id;
    await userDb.deleteOne(query);
  } catch (er) {
    throw er
  }

  res.status(200).json({ success: true, message: 'User Deleted Successfully'});
};

exports.addNewUserService = addNewUserService;
exports.updateUserService = updateUserService;
exports.getUserService = getUserService;
exports.deleteUserService = deleteUserService;
