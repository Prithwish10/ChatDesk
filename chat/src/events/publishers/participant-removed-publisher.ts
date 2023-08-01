import { ParticipantRemovedEvent, Publisher, Subjects } from "@pdchat/common";
import { Service } from "typedi";

@Service()
export class ParticipantRemovedPublisher extends Publisher<ParticipantRemovedEvent> {
  subject: Subjects.ParticipantRemoved = Subjects.ParticipantRemoved;
}
