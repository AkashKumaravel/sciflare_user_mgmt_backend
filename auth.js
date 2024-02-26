const passport = require('passport');
const constants = require('./utils/constants');
const AuthorizationError = require('./utils/errors/AuthorizationError');

const userAuthentication = (req, res, next) => {
  const apiUrl = req.path;
  const apiUrlPath = apiUrl.replace(constants.URL_ROUTER_API, '');
  if (!constants.AUTH_ROUTES.includes(apiUrlPath)) {
    passport.authenticate(
      constants.PASSPORT_STRATEGY_JWT,
      { session: false },
      async (err, user) => {
        if (err || !user) {
          res.status(401).json({ success: false, message: 'Authorization Error' });
        } else {
          req[constants.REQ_ACTIONER_INFO] = user;
          next();
        }
      }
    )(req, res);
  } else {
    next();
  }
};

const validAdminUser = (req, res, next) => {
  const actionerInfo = req[constants.REQ_ACTIONER_INFO];
  if (!actionerInfo ||  actionerInfo.user_type !== 1) {
    throw new AuthorizationError()
  } else {
    next();
  }
}

exports.userAuthentication = userAuthentication;
exports.validAdminUser = validAdminUser;
