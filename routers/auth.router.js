const constants = require('../utils/constants');
const validator = require('../validators/auth.validator');
const service = require('../services/auth.service');

module.exports = (router) => {
  router.post(
    constants.SIGN_UP,
    validator.validateOrganisationSignup,
    service.signupService,
  );
  router.post(
    constants.SIGN_IN,
    validator.validateSignIn,
    service.signInService,
  );
}