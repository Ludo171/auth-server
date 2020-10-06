const Joi = require('joi');

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

module.exports = {validateRegister, validateLogin};
