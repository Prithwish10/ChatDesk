export enum Subjects {
  UserCreated = "user:created",
  UserUpdated = "user:updated",
  UserDeleted = "user:Deleted",
  ConversationCreated = "conversation:created",
  ConversationUpdated = "conversation:updated",
  ConversationDeleted = "conversation:deleted",
  ParticipantRemoved = "participant:removed",
  ParticipantsAdded = "participants:added",
  MessageCreated = "message:created",
  MessageUpdated = "message:updated",
  MessageDeleted = "message:deleted",

  UserConnectedToChat = "user:connected",
  SendMessageToChat = "send:message",
  ParticipantAddedToChat = "participant:added",
  ParticipantRemovedFromChat = "participant:removed",
  MessgeSeen = "message:seen",
  Typing = "typing",
  StopTyping = "stop:typing",
  ConnectedUsers = "connected:users",
  WelcomeMessage = "welcome:message"
}
