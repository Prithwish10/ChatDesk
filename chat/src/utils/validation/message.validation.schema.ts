import Joi from "joi";

const createMessageSchema = Joi.object({
    _id: Joi.string().min(2).optional(),
    conversation_id: Joi.string().min(2).required(),
    sender_id: Joi.string().min(2).required(),
    content: Joi.string().min(1).required(),
    parent_message_id: Joi.string().optional(),
});

export { createMessageSchema };