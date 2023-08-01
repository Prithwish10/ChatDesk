import { ParticipantsAddedEvent, Publisher, Subjects } from "@pdchat/common";
import { Service } from "typedi";

@Service()
export class ParticipantsAddedPublisher extends Publisher<ParticipantsAddedEvent> {
  subject: Subjects.ParticipantsAdded = Subjects.ParticipantsAdded;
}
