import { body, ValidationChain } from "express-validator";

export const signUpValidation: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6 characters long"),
];
