import {KeyboardType} from 'react-native';

export interface PersonalForm {
  country?: string;
  documentType?: string;
  name: string;
  documentNumber?: string;
  birthday?: Date | string;
  gender: string;
}

export interface ChangePasswordForm {
  password: string;
  confirmPassword: string;
  newPassword: string;
}

export interface ResetPasswordForm {
  emailOrPhone: string;
  password: string;
  otp: string;
}

export interface CreateOrderForm {
  amount: string;
  price: string;
  tokenId: string;
  total?: string;
  subTotal?: string;
  fee?: string;
}

export interface BuySellorderForm {
  amount: string;
}

export interface CreateOrderFormInput {
  key: string;
  label: string;
  rightLabel?: string;
  hasMax?: boolean;
  message?: string;
  keyboardType?: KeyboardType;
  type?: string;
  editable?: boolean;
  disabled?: boolean;
  hasCustomRightIcon?: boolean;
}
