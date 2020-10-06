const jwt = require('jsonwebtoken');

const generateNewToken = (payload, tokenType = 'access_token') => {
  const jwtSecret = tokenType === 'refresh_token' ?
    process.env.JWT_REFRESH_TOKEN_SECRET : process.env.JWT_ACCESS_TOKEN_SECRET;
  const jwtOptions = {
    algorithm: 'HS256',
    expiresIn: tokenType === 'refresh_token' ?
      `${process.env.JWT_REFRESH_TOKEN_DURATION}min` :
      `${process.env.JWT_ACCESS_TOKEN_DURATION}min`,
  };
  try {
    const token = jwt.sign(payload, jwtSecret, jwtOptions);
    return token;
  } catch (err) {
    console.error(err);
    return;
  }
};

const checkUserIdFromToken = (tokenType, req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).send('No Authorization header found');

  const token = authHeader.split(' ')[1];
  const jwtSecret =
    tokenType === 'refresh_token' ?
    process.env.JWT_REFRESH_TOKEN_SECRET :
    process.env.JWT_ACCESS_TOKEN_SECRET;

  try {
    const validate = jwt.verify(token, jwtSecret);
    req.userId = validate._id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).send('Token is expired');
    }
    return res.status(403).send('Access Denied');
  }
};

module.exports = {generateNewToken, checkUserIdFromToken};
