import Joi from 'joi';

const signinSchema = Joi.object({
  type: Joi.string().required().label('OTP Type'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
});

export { signinSchema };
