import Container from "typedi";
import { UserCreatedPublisher } from "../events/publishers/User-created-publisher";
import { natsWrapper } from "./NatsWrapper";

Container.set(
  "UserCreatedPublisher",
  new UserCreatedPublisher(natsWrapper.client)
);
