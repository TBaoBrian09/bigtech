/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {NavigationRoot} from '../../navigation/root';
import RouteKey from '../../constants/RouteKey';
import {
  BuySellAPI,
  ChangePasswordAPI,
  OrderAPI,
  WithdrawalAPI,
} from '../../models/api';
import {baseUrl, shortUrl} from './Env';

const TIMEOUT = 60000;
axios.defaults.timeout = TIMEOUT;

// Add a request interceptor
axios.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (e) {
      console.log(e);
    }
    return config;
  },
  error => {
    return Promise.reject(error.response);
  },
);

const onResponseError = (error: any, logout: () => void) => {
  console.log('eer', error);
  const status = error?.response?.status;
  if (status === 403 || status === 401) {
    logout();
    return Promise.reject(error.response.data);
  }
  if (status === 429) {
    return Promise.reject(error.response.data);
  }
  if (error.response && error.response.data) {
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error.message);
};

let init = false;

export const initAxios = (handleLogout: () => void) => {
  if (!init) {
    init = true;
    // Response interceptor for API calls
    axios.interceptors.response.use(
      response => {
        // console.log('res', response);
        return response;
      },
      error => onResponseError(error, handleLogout),
    );
  }
};

export const handleClearToken = async () => {
  await AsyncStorage.removeItem('token');
  return NavigationRoot.navigate(RouteKey.AuthStack);
};

export function register(data: any) {
  return axios.post(`${baseUrl}/signUps`, data);
}

export function verifyEmailOTP(OTP: string) {
  return axios.post(`${baseUrl}/users/email-verifications`, {otp: OTP});
}

export function verifyPhoneOTP(OTP: string) {
  return axios.post(`${baseUrl}/users/phone-verifications`, {otp: OTP});
}

export function getMe() {
  return axios(`${baseUrl}/users/me`);
}

export function resendOTP(isResendEmail: boolean) {
  if (isResendEmail) {
    return axios.post(`${baseUrl}/users/email-verify-sendings`, {});
  }
  return axios.post(`${baseUrl}/users/sms-verify-sendings`, {});
}

export function login(data: any) {
  return axios.post(`${baseUrl}/sessions`, data);
}

export function forgotPassword(data: any) {
  return axios.post(`${baseUrl}/users/password-recoveries`, data);
}

export function resetPassword(data: any) {
  return axios.post(`${baseUrl}/users/password`, data);
}

export function updateKYC(formData: any) {
  return axios.patch(`${baseUrl}/users/me`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: (data, headers) => {
      return formData;
    },
  });
}

export function getUserDetail() {
  return axios.get(`${baseUrl}/users/me`);
}

export function updateUser(data: any) {
  return axios.patch(`${baseUrl}/users/me`, data);
}

export function changePassword({password, newPassword}: ChangePasswordAPI) {
  return axios.put(`${baseUrl}/users/me/password`, {
    password,
    newPassword,
  });
}

export function getAllToken() {
  return axios.get(`${baseUrl}/tokens`);
}

export function getWallet() {
  return axios.get(`${baseUrl}/users/me/wallets`);
}

export async function getFee() {
  return axios.get(`${baseUrl}/fees`);
}

export function getTokenBalance(tokenAddress: string) {
  return axios.get(`${baseUrl}/users/me/wallets/balances/${tokenAddress}`);
}

export function withdrawalOffChain(data: WithdrawalAPI) {
  return axios.post(`${baseUrl}/users/me/wallets/off-chain-withdrawals`, data);
}

export function withdrawalOnChain(data: WithdrawalAPI) {
  return axios.post(`${baseUrl}/users/me/wallets/on-chain-withdrawals`, data);
}

export function getTokenTransaction({
  tokenAddress,
  pageSize = 10,
  pageNumber,
  fromDate,
  toDate,
  transactionType,
}: {
  pageSize?: number;
  pageNumber: number;
  tokenAddress: string;
  fromDate?: string;
  toDate?: string;
  transactionType?: string;
}) {
  let apiUrl = `${baseUrl}/users/me/wallets/tokens/${tokenAddress}/transactions?page=${pageNumber}&limit=${pageSize}`;

  if (fromDate && toDate) {
    apiUrl = apiUrl + `&fromDate=${fromDate}&toDate=${toDate}`;
  }
  if (transactionType) {
    apiUrl = apiUrl + `&transactionType=${transactionType}`;
  }
  return axios.get(`${apiUrl}`);
}

export function getWalletTransaction(transactionId: string) {
  return axios.get(`${baseUrl}/users/me/wallets/transactions/${transactionId}`);
}

export function searchUser({
  keyword,
  pageSize = 10,
  pageNumber,
}: {
  keyword: string;
  pageSize?: number;
  pageNumber: number;
}) {
  return axios.get(
    `${baseUrl}/users?search=${keyword}&page=${pageNumber}&limit=${pageSize}`,
  );
}

export function getSupportListToken() {
  return axios.get(`${baseUrl}/tokens`);
}

export function getTokenPriceList() {
  return axios.get('https://mobile-bds-prices.netlify.app/api/hello');
}

export function getTransactionFee() {
  return axios.get(`${baseUrl}/tokens/transaction-fees`);
}

export function getFile(filePath: string) {
  return `${shortUrl}/files/${filePath}`;
}

export function getAllOrders({
  keyword = '',
  page = 0,
  limit = 10,
  sortOrder = 'DESC',
  type = 'buy',
  tokenId,
}: OrderAPI) {
  return axios.get(
    `${baseUrl}/p2p/orders?search=${keyword}&page=${page}&limit=${limit}&sortOrder=${sortOrder}&type=${type}&tokenId=${tokenId}&sortBy=price`,
  );
}

export function getAllOrdersByUserId({
  keyword = '',
  page = 0,
  limit = 10,
  sortOrder = 'DESC',
  userId,
  tokenId,
}: OrderAPI) {
  return axios.get(
    `${baseUrl}/p2p/orders?search=${keyword}&page=${page}&limit=${limit}&sortOrder=${sortOrder}&tokenId=${tokenId}&sortBy=price&userId=${userId}`,
  );
}

export function getOrderTransaction({
  keyword = '',
  page = 0,
  limit = 10,
  sortOrder = 'DESC',
  orderId,
}: OrderAPI) {
  let url = `${baseUrl}/p2p/orders/${orderId}/transactions?search=${keyword}&page=${page}&limit=${limit}&sortOrder=${sortOrder}`;

  return axios.get(url);
}

export function createOrderSell(data: any) {
  return axios.post(`${baseUrl}/p2p/sell-orders`, data);
}

export function createOrderBuy(data: any) {
  return axios.post(`${baseUrl}/p2p/buy-orders`, data);
}

export function sellToBuyOrder({orderId, amount, otp}: BuySellAPI) {
  return axios.post(`${baseUrl}/p2p/buy-orders/${orderId}/sells`, {
    amount,
    otp,
  });
}

export function buyToSellOrder({orderId, amount, otp}: BuySellAPI) {
  return axios.post(`${baseUrl}/p2p/sell-orders/${orderId}/buys`, {
    amount,
    otp,
  });
}

export function generateOTP(type: string) {
  return axios.post(`${baseUrl}/otp`, {type});
}

export function cancelOrder(orderId: string) {
  return axios.delete(`${baseUrl}/p2p/orders/${orderId}`);
}

export function getMyOrders({
  page = 0,
  limit = 10,
  type = '',
  status,
  tokenId = 0,
  keyword = '',
}: OrderAPI) {
  let url = `${baseUrl}/me/orders?page=${page}&limit=${limit}&search=${keyword}`;
  if (type) {
    url += `&type=${type}`;
  }
  if (status) {
    url += `&status=${status}`;
  }
  if (tokenId > 0) {
    url += `&tokenId=${tokenId}`;
  }
  return axios.get(url);
}

export async function uploadFileS3(type: string, name: string, uri: string) {
  const linkRes = await axios.get(
    `${baseUrl}/users/me/kyc-upload-links?contentType=${type}`,
  );
  const {fileKey, url} = linkRes.data;

  await uploadFile(url, uri, type, name);
  return fileKey;
}

export const uploadFile = (
  url: string,
  filePath: string,
  fileType: string,
  fileName: string,
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // success
          resolve('Success');
        } else {
          reject();
          // failure
        }
      }
    };
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', fileType);
    xhr.send({uri: filePath, type: fileType, name: fileName});
  });
};
