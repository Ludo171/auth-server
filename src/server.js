const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Express server instance
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
server.get('/', (req, res) => {
  res.send('This is a new Node Express Server !');
});

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening port ${PORT}...`);
});
