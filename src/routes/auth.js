// eslint-disable-next-line new-cap
const router = require('express').Router();
const {validateRegister, validateLogin} = require('../models/validator');
const bcrypt = require('bcrypt');
const {generateNewToken} = require('../auth/jwtTokens');
const User = require('../models/User');

// POST /auth/register
// |---> Register a new user
router.post('/register', async (req, res) => {
  try {
  // Validate
    const {error} = validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if email exists
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) return res.status(400).send('Email already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    // Save user into DB
    const user = new User({...req.body, password: hash});
    try {
      const savedUser = await user.save();
      return res.send(
          {
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            role: savedUser.role,
          },
      );
    } catch (err) {
      console.error(err);
      return res.status(500)
          .send('Something went wrong when creating this new user.');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something is wrong with the server');
  }
});

// POST /auth/login
// |---> Login with User credentials to get access token
router.post('/login', async (req, res) => {
  // Validate
  const {error} = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email exists
  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send('Wrong email or password.');

  // Check password validity
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Wrong email or password.');

  // Generate token with user's id and role.
  const token = await generateNewToken({_id: user._id}, 'access_token');

  return res.send({access_token: token, email: user.email});
});

module.exports = router;
