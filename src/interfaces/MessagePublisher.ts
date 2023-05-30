interface MessagePublisher {
    publishMessage(conversation_id: string, message: any): Promise<void>;
}

export default MessagePublisher;