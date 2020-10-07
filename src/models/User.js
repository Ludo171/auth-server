const {dbClient} = require('./database-client');
const ROLES = require('./Roles.enum');

const roles = Object.keys(ROLES).map((key) => ROLES[key]);

const userSchema = new dbClient.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {type: String, enum: roles, default: ROLES.COMMON},
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = dbClient.model('User', userSchema);
