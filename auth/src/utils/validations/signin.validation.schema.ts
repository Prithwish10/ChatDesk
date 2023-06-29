import Joi from "joi";

const signupSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).max(20).required().label("Password"),
});

export { signupSchema };
