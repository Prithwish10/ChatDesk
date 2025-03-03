import { Service } from 'typedi';
import { User } from '../models/User.model';
import { Types } from 'mongoose';
import { logger } from '../loaders/logger';
import { IUserAttrs, IUserDoc } from '../interfaces/IUser';
import { Participant } from '@pdchat/common/build/interfaces/Participant';

@Service()
export class UserRepository {
  constructor() {}

  public async create(user: IUserAttrs): Promise<IUserDoc> {
    try {
      const newUser = User.build(user);
      let savedUser = await newUser.save();

      return savedUser;
    } catch (error) {
      logger.error('Error occured while creating user');
      throw error;
    }
  }

  public async findById(id: string): Promise<IUserDoc | null> {
    try {
      const objectId = new Types.ObjectId(id);
      const user = await User.findById(objectId);

      return user;
    } catch (error) {
      logger.error(`Error occured while fetching user by Id: ${id}`);
      throw error;
    }
  }

  public async findByIdAndPreviousVersion(id: string, version: number): Promise<IUserDoc | null> {
    try {
      const user = await User.findByEvent({ id, version });

      return user;
    } catch (error) {
      logger.error(`Error occured while fetching user by Id: ${id} and version: ${version}`);
      throw error;
    }
  }

  public async updateByUserDoc(userById: IUserDoc, user: Partial<IUserAttrs>): Promise<IUserDoc> {
    try {
      userById.set(user);
      await userById.save();

      return userById;
    } catch (error) {
      logger.error('Error occured while fetching user by user doc');
      throw error;
    }
  }

  public async doesParticipantsExist(participants: Participant[]): Promise<boolean> {
    try {
      for (let participant = 0; participant < participants.length; participant++) {
        const user = await User.findById(participants[participant].user_id);
        if (!user) {
          return false;
        }
      }
      return true;
    } catch (error) {
      logger.error('Error occured while checking whether participants exists or notc');
      throw error;
    }
  }
}
