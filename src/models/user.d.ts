export interface UserRegister {
  name?: string;
  username?: string;
  password: string;
  phoneNumber?: string;
  email?: string;
  profile: Profile;
}

export interface UserLoginAPI {
  email?: string;
  phoneNumber?: string;
  password: string;
  deviceId?: string;
}

interface Profile {
  avatar?: any;
  country?: string;
  documentNumber?: string;
  documentType?: string;
  gender?: string;
  name?: string;
  verifyStatus?: KycStatus;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  phoneNumber?: PhoneNumber;
  email?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  assets: {
    usdt: number;
    bds: number;
  };
  onChainAssets: {
    usdt: number;
    bds: number;
  };
  createdAt: string;
  updatedAt: string;
  role: string;
  profile: Profile;
}
export interface PhoneNumber {
  number: string;
  callingCode: string;
}

export enum KycStatus {
  None = 'none',
  Pending = 'pending',
  Done = 'done',
  Rejected = 'rejected',
  Uploaded = 'uploaded',
  Verified = 'verified',
}

export interface UserData {
  privateWallet: PrivateWallet;
  publicWallet: PrivateWallet;
  customPrice?: PriceToken;
  priceToken?: PriceToken;
}

export interface PrivateWallet {
  address?: string;
  id?: number;
  tokens?: Token[];
}

export interface Token {
  address?: string;
  balance?: number | string;
  id?: string;
  lockedBalance?: string;
}

export interface PriceToken {
  [token as string]: {
    symbol?: string;
    address?: string;
    price?: string;
    name?: string;
  };
}
