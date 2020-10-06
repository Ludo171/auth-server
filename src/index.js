require('dotenv').config();
const {getServerInstance, startServer, stopServer} = require('./server');
const {startDbClient} = require('./models/database-client');

// Express server instance
const server = getServerInstance();
const dbClient = startDbClient();
startServer(server);

setTimeout(() => {
  dbClient.connection.close();
}, 10000);
