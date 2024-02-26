const constants = require('../utils/constants');
const validator = require('../validators/organisation.validator');
const service = require('../services/organisation.service')
const auth = require('../auth');

module.exports = (router) => {
  router.put(
    constants.ORGANISATION_URL,
    auth.validAdminUser,
    validator.validateUpdateOrgDetails,
    service.updateOrganisationService,
  );
  router.delete(
    constants.ORGANISATION_ID_URL,
    auth.validAdminUser,
    validator.validateDeleteOrganisation,
    service.deleteOrganisationService,
  );
  router.get(
    constants.ORGANISATION_ID_URL,
    auth.validAdminUser,
    validator.validateGetOrganisation,
    service.getOrganisationService,
  );
}