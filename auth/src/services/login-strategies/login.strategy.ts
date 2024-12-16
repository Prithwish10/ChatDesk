import { UserDoc } from '../../interfaces/User';

export interface ILoginStrategy {
  login(user: UserDoc, credential: string): Promise<string>;
}
