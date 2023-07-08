import Joi from "joi";

const signupSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required().label("First name"),
  lastName: Joi.string().min(1).max(50).required().label("Last name"),
  image: Joi.string().min(1).max(200).optional().label("Image"),
  mobileNumber: Joi.string()
    .length(10)
    .regex(/^\d+$/)
    .messages({ "string.pattern.base": `Mobile number must have 10 digits.` })
    .required()
    .label("Mobile number"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
});

export { signupSchema };
