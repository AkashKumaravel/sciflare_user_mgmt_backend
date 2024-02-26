const express = require('express');
const cors = require('cors');
const apiRouter = require('../routers/route');
const  { URL_ROUTER_API } = require('../utils/constants');
const utils = require('../utils/utils')
const { userAuthentication } = require('../auth');

module.exports = async (app) => {
  app.use(express.json());

  app.use(cors())

  app.get('/', (req, res) => {
    res.send('Welcome to the Home Page')
  });

  app.use(userAuthentication);

  const router = express.Router();
  app.use(URL_ROUTER_API, router);

  await apiRouter(router);

  app.use((req, res, next) => {
    throw Error('urlNotFound');
  });

  app.use((err, req, res, next) => {
    if (err) {
      utils.errorHandler(err, res);
    }
  });
};