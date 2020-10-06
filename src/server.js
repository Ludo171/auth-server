const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

const getServerInstance = () => {
  const server = express();
  // Cors
  const corsOptions = {
    origin: 'http://localhost:3000',
  };
  server.use(cors(corsOptions));

  // parse requests of content-type - application/json
  server.use(bodyParser.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({extended: true}));

  // Routes
  server.use('/auth', authRoute);
  server.use('/user', userRoute);
  return server;
};

const startServer = (server) => {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Server listening port ${PORT}...`);
  });
};

const stopServer = (server) => {
  server.close();
};

module.exports = {getServerInstance, startServer, stopServer};

