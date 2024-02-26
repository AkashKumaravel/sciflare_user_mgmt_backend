const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const constants = require('../utils/constants');
const utils = require('../utils/utils');

passport.use(
  constants.PASSPORT_STRATEGY_LOCAL,
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (async (req, username, password, cb) => {
      const db = await utils.getDbConnection(constants.COLLECTION_NAME_ORGANISATION);
      const userDb = await utils.getDbConnection(constants.COLLECTION_NAME_USERS);

      let orgDetails = await db.find({ org_name: req.body.org_name }).limit(1);
      orgDetails = (await orgDetails.toArray()).map((resultItem) => resultItem)[0];
      if (utils.isEmpty(orgDetails)) return cb(null, null, 'Invalid Organisation');

      let userDetails = await userDb.find({ username: username, account_id: orgDetails['_id'] }).limit(1);
      userDetails = (await userDetails.toArray()).map((resultItem) => resultItem)[0];

      if (utils.isEmpty(userDetails)) return cb(null, null, 'Invalid Username')
      const validPassword = await utils.comparePassword(password, userDetails.password);

      if (!validPassword) return cb(null, null, 'Invalid Password')
      return cb(null, userDetails);
    })
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY || 'secret_pass_key',
      passReqToCallback: false,
    },
    async (jwt_payload, cb) => {
      const userDb = await utils.getDbConnection(constants.COLLECTION_NAME_USERS);

      let userDetails = await userDb.find({
        _id: utils.generateObjectId(jwt_payload['user_id']),
        account_id: utils.generateObjectId(jwt_payload['account_id'])
      }).project({ password: 0 }).limit(1);
      userDetails = (await userDetails.toArray()).map((resultItem) => resultItem)[0];

      if (utils.isEmpty(userDetails)) return cb('Authorization Error')
      return cb(null, userDetails);
    }
  )
);
