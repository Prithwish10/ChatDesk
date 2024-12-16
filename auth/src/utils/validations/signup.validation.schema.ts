import Joi from 'joi';

const signupSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required().label('First name'),
  lastName: Joi.string().min(1).max(50).required().label('Last name'),
  image: Joi.string().min(1).max(200).optional().label('Image'),
  countryCode: Joi.string()
    .pattern(/^\+\d{1,3}$/)
    .messages({
      'string.pattern.base': `Country code must be a plus sign followed by 1 to 3 digits.`,
    })
    .required()
    .label('Country code'),
  mobileNumber: Joi.string()
    .length(10)
    .regex(/^\d+$/)
    .messages({ 'string.pattern.base': `Mobile number must have 10 digits.` })
    .required()
    .label('Mobile number'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
});

export { signupSchema };
