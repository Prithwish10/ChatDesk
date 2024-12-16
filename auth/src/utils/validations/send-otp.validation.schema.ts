import Joi from 'joi';

const sendOTPSchema = Joi.object({
  type: Joi.string().required().label('OTP Type'),
  recipient: Joi.string().email().required().label('Recipient'),
  otp: Joi.string().required().label('OTP'),
  userFirstName: Joi.string().required().label('Username'),
});

export { sendOTPSchema };
