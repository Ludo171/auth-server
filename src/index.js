require('dotenv').config();
const {startServer, stopServer} = require('./server');
const {startDbClient, stopDbClient} = require('./models/database-client');

startDbClient();
startServer();

setTimeout(() => {
  stopServer();
  stopDbClient();
}, 60 * 1000);
