import Joi from "joi";

const createSearchSchema = Joi.object({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  //   sort: Joi.string().optional(),
  //   order: Joi.string().valid("asc", "dsc").optional(),
  users: Joi.boolean().optional(),
  groups: Joi.boolean().optional(),
  all: Joi.boolean().optional(),
  keyword: Joi.string().optional(),
});

export { createSearchSchema };
