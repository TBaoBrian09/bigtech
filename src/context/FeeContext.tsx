import {createContext} from 'react';

export interface FeeData {
  feeToken: any;
  onchainWithdraw?: number;
  p2pOrder?: number;
  p2pTransaction?: number;
}

export interface FeeContextData {
  data?: FeeData;
  setData?: (newData: FeeData) => void;
}

export const FeeContext = createContext<FeeContextData>({
  data: undefined,
  setData: undefined,
});
