export interface SocketEventSubscriber {
  subscribe(channel: string): void;
  listen(): void;
}
