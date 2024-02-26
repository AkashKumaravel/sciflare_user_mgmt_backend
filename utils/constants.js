exports.URL_ROUTER_API = '/api';

exports.DATABASE_NAME = 'sciflare_user_management';

// routes
const SIGN_IN = '/sign_in';
const SIGN_UP = '/sign_up';
exports.ORGANISATION_URL = '/organisation';
exports.ORGANISATION_ID_URL = '/organisation/:_id';
exports.USERS_URL = '/users';
exports.USERS_ID_URL = '/users/:_id';
exports.AUTH_ROUTES = [ SIGN_IN, SIGN_UP ];
exports.SIGN_IN = SIGN_IN;
exports.SIGN_UP = SIGN_UP;

// collection names
exports.COLLECTION_NAME_ORGANISATION = 'organisation';
exports.COLLECTION_NAME_USERS = 'users';

// User types
exports.USER_TYPE_ADMIN = 1;
exports.USER_TYPE_BASIC = 2;

// Passport Strategy
exports.PASSPORT_STRATEGY_LOCAL = 'local';
exports.PASSPORT_STRATEGY_JWT = 'jwt';

// actionerInfo
exports.REQ_ACTIONER_INFO = 'actioner_info';