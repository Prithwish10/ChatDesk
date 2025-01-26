import Joi from 'joi';
import { LoginType } from '../../enums/LoginType';

const signinSchema = Joi.object({
  login_type: Joi.string()
    .valid(...Object.values(LoginType))
    .required()
    .label('login_type'),
  recipientId: Joi.string()
    .required()
    .custom((value, helpers) => {
      const isEmail = Joi.string().email().validate(value).error === undefined;
      const isMobile = /^\+[1-9]\d{1,14}$/.test(value); // E.164 format regex

      if (!isEmail && !isMobile) {
        return helpers.error('any.custom', {
          message:
            'RecipientId must be a valid email or mobile number in the format +[countryCode][nationalNumber].',
        });
      }
      return value;
    })
    .label('Recipient ID'),
  credential: Joi.string().min(6).required().label('credential'),
});

export { signinSchema };
