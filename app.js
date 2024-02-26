const express = require('express');

require('dotenv').config()

const app = express();

require('./loaders/loader')(app);
require('./loaders/passport');

app.listen(process.env.PORT_NUMBER, () =>{
  console.log(`Listening on port ${process.env.PORT_NUMBER}`)
})