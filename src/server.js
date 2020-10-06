require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const {startDbClient} = require('./models/database-client');

// Express server instance
const server = express();
const dbClient = startDbClient();

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

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening port ${PORT}...`);
});
