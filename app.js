const express = require('express');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());

require('dotenv').config();
global.utils = require('./utils/global');
require('./routes')(app);

app.listen(process.env.PORT, process.env.HOST, () => {
  console.info('[Gogung APIServer] Listening on port %s at %s', 
  process.env.PORT, process.env.HOST);
});

module.exports = app;