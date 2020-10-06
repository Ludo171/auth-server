const {validateRegisterUser} = require('../models/validator');

// eslint-disable-next-line new-cap
const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');


// POST /auth/register
// |---> Register a new user
router.post('/register', async (req, res) => {
  // Validate
  const {error} = validateRegisterUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email exists
  const emailExists = await User.findOne({email: req.body.email});
  if (emailExists) return res.status(400).send(emailExists);

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  // Save user into DB
  const user = new User({...req.body, password: hash});
  try {
    const savedUser = await user.save();
    return res.send(
        {firstName: savedUser.firstName, lastName: savedUser.lastName, email: savedUser.email},
    );
  } catch (err) {
    return res.status(500)
        .send('Something went wrong when creating this new user.');
  }
});

module.exports = router;
