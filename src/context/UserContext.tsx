import {createContext} from 'react';
import {UserData} from '../models/user';

export const UserContext = createContext<UserData>({
  privateWallet: {},
  publicWallet: {},
});
