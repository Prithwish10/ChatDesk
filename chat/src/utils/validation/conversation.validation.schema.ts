import Joi from "@hapi/joi";

const createConversationSchema = Joi.object({
    participants: Joi.array().required(),
    isGroup: Joi.boolean().required(),
    group_name: Joi.string().min(1).optional(),
});

export { createConversationSchema };