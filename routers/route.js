const authRouter = require('./auth.router');
const organisationRouter = require('./orgranisation.router');
const userRouter = require('./user.router');

// Wraps all the Async route middleware with a catch & pass the error to error handing middleware
require('express-async-errors');

module.exports = async (router) => {
  authRouter(router);
  organisationRouter(router);
  userRouter(router);
};
