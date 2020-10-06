// eslint-disable-next-line new-cap
const router = require('express').Router();
const User = require('../models/User');
const {checkUserIdFromToken} = require('../auth/jwtTokens');
const RolesEnum = require('../models/Roles.enum');
const {validateUserModifications} = require('../models/validator');

const checkAccessToken = (req, res, next) => checkUserIdFromToken('access_token', req, res, next);

// GET User by email
// |--> Get user info [if authorized]
router.get('/:userEmail', checkAccessToken, async (req, res) => {
  try {
    const userToGet = await User.findOne({email: req.params.userEmail});
    if (!userToGet) return res.status(403).send('Could not find user id');

    const user = await User.findById(req.userId);
    if (userToGet.email !== user.email && user.role !== RolesEnum.ADMIN) {
      return res.status(403).send('Unauthorized');
    }

    return res.send(userToGet);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something is wrong with the server');
  }
});

// PUT User by Id
// |--> Modify User [if admin or targeted user]
router.put( '/:id', checkAccessToken, async (req, res) => {
  try {
    // Validate Modifications
    const {error} = validateUserModifications(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find user to update
    const userToUpdate = await User.findOne({_id: req.params.id});
    if (!userToUpdate) return res.status(400).send('User Id does not exist');

    // Check if user is authorized to modify userToUpdate
    const user = await User.findOne({_id: req.userId});
    if (user.role !== RolesEnum.ADMIN && req.params.id !== req.userId) {
      return res.status(403).send('Unauthorized');
    }

    if (Object.keys(req.body).includes('role') && user.role !== RolesEnum.ADMIN) {
      return res.status(403).send('Unauthorized - only admins can change roles');
    }

    // Update user
    Object.keys(req.body).forEach((key) => {
      if (key !== 'role' || user.role === RolesEnum.ADMIN) {
        userToUpdate[key] = req.body[key];
      }
    });
    const updatedUser = await userToUpdate.save();
    return res.send(updatedUser);
  } catch (err) {
    return res.status(500).send('Something is wrong with the server');
  }
});

// DELETE User
// |--> Delete user [if admin]
router.delete('/:id', checkAccessToken, async (req, res) => {
  try {
  // Find user to delete
    const userToDelete = await User.findOne({_id: req.params.id});
    if (!userToDelete) return res.status(400).send('User Id does not exist');

    // Check if user is admin
    const user = await User.findOne({_id: req.userId});
    if (user.role !== RolesEnum.ADMIN) {
      return res.status(403).send('Unauthorized - only admins can delete users');
    }

    // Delete user
    const deletedUser = await User.deleteOne({_id: req.params.id});
    res.send(deletedUser);
  } catch (err) {
    return res.status(500).send('Something is wrong with the server');
  }
});
module.exports = router;
