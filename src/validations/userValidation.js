import Joi from 'joi';

const validation = (user) => {
  const userSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/\d{11}/),
    username: Joi.string().min(3).max(10),
    password: Joi.string().min(6).max(20).required(),
  }).unknown();
  return userSchema.validate(user);
};

export default validation;
