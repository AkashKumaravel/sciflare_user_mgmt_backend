const passport = require('passport');
const utils = require('../utils/utils');
const constants = require('../utils/constants');
const ValidationError = require('../utils/errors/ValidationError');

const signupService = async (req, res) => {
  const db = await utils.getDbConnection(constants.COLLECTION_NAME_ORGANISATION);
  const userDb = await utils.getDbConnection(constants.COLLECTION_NAME_USERS);
  const data = req.body;

  const query = { org_name: data.org_name };
  let orgDetails = await db.find(query).limit(1);
  orgDetails = (await orgDetails.toArray()).map((resultItem) => resultItem);
  if (!utils.isEmpty(orgDetails)) throw new ValidationError('Organisation Already Exists');

  const userQuery = { email: data.email };
  let userDetails = await userDb.find(userQuery);
  userDetails = (await userDetails.toArray()).map((resultItem) => resultItem);
  if (!utils.isEmpty(userDetails)) throw new ValidationError('Email Already Exists');

  const userId = utils.generateObjectId();
  const inputData = {
    org_name: data.org_name,
    created_on: new Date(),
    created_by: userId
  }
  const result = await db.insertOne(inputData);

  const userData = {
    _id: userId,
    account_id: result.insertedId,
    ...utils.pick(data, ['username', 'password', 'email']),
    user_type: constants.USER_TYPE_ADMIN,
    last_updated_on: userId,
    last_updated_by: new Date()
  }

  await userDb.insertOne(userData);
  res.status(201).json({ success: true });
};

const signInService = async (req, res) => {
  await passport.authenticate(
    constants.PASSPORT_STRATEGY_LOCAL,
    { session: false },
    async (err, user, errorInfo) => {
      if (err || !user || errorInfo) {
        res.status(401).json({ success: false, message: errorInfo });
      } else {
        const token = await utils.generateJwtToken(user);
        res.status(200).json({ success: true, message: 'Login Success', token, data: { _id: user['_id'], account_id: user['account_id'], user_type: user['user_type']}});
      }
    }
  )(req, res);
};


exports.signupService = signupService;
exports.signInService = signInService;
