import Type from 'mongoose'

export interface IReaction {
    userId: Type.ObjectId,
    reaction: string
}