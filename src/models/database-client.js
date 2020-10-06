const mongoose = require('mongoose');

const startDbClient = () => {
  mongoose.connect(process.env.MONGO_CONNECT_URL,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err) => {
        if (err) {
          console.log('Error on connection to DB...');
          return;
        }
        console.log('Successful connection to MongoDB database !');
      });
  mongoose.set('useCreateIndex', true);
  return mongoose;
};

module.exports = {startDbClient};
