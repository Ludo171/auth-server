const Joi = require('joi');
const RolesEnum = require('./Roles.enum');
const roles = Object.keys(RolesEnum).map((key) => RolesEnum[key]);

const validateRegister = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(255).required(),
    lastName: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).required(),
  });
  const validate = schema.validate(body);
  return validate;
};

const validateLogin = (body) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).required(),
  });
  const validate = schema.validate(body);
  return validate;
};

const validateUserModifications = (body) => {
  const schema = Joi.object({
    password: Joi.string().min(6),
    email: Joi.string().min(6).max(255).email(),
    firstName: Joi.string().min(2).max(255),
    lastName: Joi.string().min(2).max(255),
    role: Joi.string().valid(...roles),
  });

  const validate = schema.validate(body);
  return validate;
};

module.exports = {validateRegister, validateLogin, validateUserModifications};
