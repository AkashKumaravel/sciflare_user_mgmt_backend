const constants = require('../utils/constants');
const validator = require('../validators/users.validator');
const service = require('../services/users.service');
const auth = require('../auth');

module.exports = (router) => {
  router.post(
    constants.USERS_URL,
    auth.validAdminUser,
    validator.validateAddUser,
    service.addNewUserService,
  );
  router.put(
    constants.USERS_URL,
    validator.validateUpdateUser,
    service.updateUserService,
  );
  router.get(
    constants.USERS_URL,
    validator.validateGetUser,
    service.getUserService,
  );
  router.delete(
    constants.USERS_ID_URL,
    validator.validateDeleteUser,
    service.deleteUserService,
  );
};