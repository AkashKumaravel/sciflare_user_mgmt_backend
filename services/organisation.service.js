const utils = require('../utils/utils');
const constants = require('../utils/constants');
const ValidationError = require('../utils/errors/ValidationError');

const updateOrganisationService = async (req, res, next) => {
  const db = await utils.getDbConnection(constants.COLLECTION_NAME_ORGANISATION);

  const data = req.body;
  const actionerInfo = req[constants.REQ_ACTIONER_INFO];

  const query = { _id: utils.generateObjectId(data['_id']) };
  let orgDetails = await db.find(query).limit(1);
  orgDetails = (await orgDetails.toArray()).map((resultItem) => resultItem)[0];

  if (utils.isEmpty(orgDetails)) throw new ValidationError('Organisation not exist');

  const updatedInput = utils.pick(data, ['address', 'description', 'country', 'timezone', 'industry']);
  if (utils.isEmpty(updatedInput)) throw new ValidationError('Provide Input to update');

  updatedInput['updated_on'] = new Date();
  updatedInput['updated_by'] = actionerInfo['_id'];
  try {
    await db.updateOne(query, { $set: updatedInput });
  } catch (er) {
    throw er
  }

  res.status(200).json({ success: true, message: 'Organisation Updated Successfully' });
};

const deleteOrganisationService = async (req, res, next) => {
  const db = await utils.getDbConnection(constants.COLLECTION_NAME_ORGANISATION);
  const userDb = await utils.getDbConnection(constants.COLLECTION_NAME_USERS);
  const { _id } = req.params;

  const query = { _id: utils.generateObjectId(_id) };
  let orgDetails = await db.find(query).limit(1);
  orgDetails = (await orgDetails.toArray()).map((resultItem) => resultItem)[0];

  if (utils.isEmpty(orgDetails)) throw new ValidationError('Organisation not exist');

  try {
    // Deleting all the users from the organisation
    await userDb.deleteMany({ account_id: utils.generateObjectId(_id) });

    // Deleting the organisation
    await db.deleteOne(query);
  } catch (er) {
    throw er
  }

  res.status(200).json({ success: true, message: 'Organisation Deleted Successfully' });
};

const getOrganisationService = async (req, res, next) => {
  const db = await utils.getDbConnection(constants.COLLECTION_NAME_ORGANISATION);
  const { _id } = req.params;

  const query = { _id: utils.generateObjectId(_id) };
  let orgDetails = await db.find(query).limit(1);
  orgDetails = (await orgDetails.toArray()).map((resultItem) => resultItem)[0];

  if (utils.isEmpty(orgDetails)) throw new ValidationError('Organisation not exist');

  res.status(200).json({ success: true, data: orgDetails });
};


exports.updateOrganisationService = updateOrganisationService;
exports.deleteOrganisationService = deleteOrganisationService;
exports.getOrganisationService = getOrganisationService;
