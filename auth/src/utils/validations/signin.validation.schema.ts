import Joi from 'joi';

const signinSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
});

export { signinSchema };
