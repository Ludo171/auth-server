const mongoose = require('mongoose');
const dbClient = new mongoose.Mongoose();
let retryCount = 0;

// Seems Mongoose client handles any deconnection issues.
// We need to handle the case when mongoose cannot connect from the start with a retrying mechanism
const startDbClient = async () => {
  dbClient.connect(
      process.env.MONGO_CONNECT_URL,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err) => {
        if (err) {
          console.log('[MongoClient] Could not connect to Mongo Database');
          if (retryCount < process.env.MONGO_CONNECT_MAX_RETRIES) {
            console.log(`[MongoClient] : New attemp in ${process.env.MONGO_CONNECT_RETRY_DELAY}s ...`);
            return setTimeout(async () => {
              await dbClient.disconnect();
              retryCount += 1;
              startDbClient(retryCount);
            }, process.env.MONGO_CONNECT_RETRY_DELAY * 1000);
          }
        }
        clearTimeout();
      });
  dbClient.set('useCreateIndex', true);

  if (retryCount === 0) {
    dbClient.connection.on('error', (err) => console.error('[MongoClient] Connection error'));
    dbClient.connection.on('disconnected', () => console.log('[MongoClient] DbClient disconnected'));
    dbClient.connection.on('reconnect', () => console.log('[MongoClient] Db Client Reconnected !'));
    dbClient.connection.on('open', () => console.log('[MongoClient] Connection successful !'));
  }
};

const stopDbClient = async () => {
  dbClient.disconnect();
  retryCount = 0;
};


module.exports = {dbClient, startDbClient, stopDbClient};
