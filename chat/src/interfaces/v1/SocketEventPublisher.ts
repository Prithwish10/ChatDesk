export interface SocketEventPublisher {
  publish(channel: string, data: string): void;
}