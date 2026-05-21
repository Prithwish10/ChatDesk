import { IParticipant } from "./IParticipant";

export interface IPayload {
    id: string,
    participants?: IParticipant[],
    participantId?: string,
    version: number
}