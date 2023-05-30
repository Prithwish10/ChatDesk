interface MessageSubscriber {
    consumeMessage(conversation_id: string): Promise<void>;
}

export default MessageSubscriber;