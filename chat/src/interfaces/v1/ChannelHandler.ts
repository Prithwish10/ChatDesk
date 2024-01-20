export interface ChannelHandler<T> {
  handle(data: T): void;
}
