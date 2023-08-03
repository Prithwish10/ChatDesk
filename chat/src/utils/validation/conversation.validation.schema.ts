import Joi from "joi";

const participantSchema = Joi.object({
  user_id: Joi.string().required(),
  role: Joi.string().valid("personal", "group").required(),
  status: Joi.string().valid('Active', 'Blocked').optional(),
  isAdmin: Joi.boolean().optional()
});

const createConversationSchema = Joi.object({
  participants: Joi.array().items(participantSchema).min(1).required(),
  isGroup: Joi.boolean().required(),
  group_name: Joi.string().min(1).optional(),
});

export { createConversationSchema };