export interface ChangePasswordAPI {
  password: string;
  newPassword: string;
}

export interface WithdrawalAPI {
  tokenAddress: string;
  amount: string;
  recipient?: string;
}

export interface OrderAPI {
  keyword?: string;
  page?: number;
  limit?: number;
  sortOrder?: string;
  type?: string;
  tokenId?: number | string;
  status?: string;
  orderId?: string;
  userId?: string;
}

export interface BuySellAPI {
  orderId: string;
  amount: string;
  otp: string;
}
