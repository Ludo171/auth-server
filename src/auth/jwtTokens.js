const jwt = require('jsonwebtoken');

const generateNewToken = async (payload, type = 'access_token') => {
  const jwtSecret =
    type === 'refresh_token' ?
    process.env.JWT_REFRESH_TOKEN_SECRET :
    process.env.JWT_ACCESS_TOKEN_SECRET;
  const token = await jwt.sign(payload, jwtSecret);
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.headers;
  console.log(token);
  next();
};

module.exports = {generateNewToken};
