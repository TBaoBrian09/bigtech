import {Alert, Dimensions, Linking, Platform, StatusBar} from 'react-native';
// import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import {get, isEmpty} from 'lodash';
import {PERMISSIONS, check} from 'react-native-permissions';
import format from 'date-fns/format';
import findLastIndex from 'lodash/findLastIndex';

import {isIOS} from '../constants/Layout';
import {PhoneNumber, Token} from '../models/user';
import BigNumber from 'bignumber.js';
import {customListTokens, listTokens} from './Constants';

export function getStatusBarHeight(skipAndroid = false) {
  if (isIOS()) {
    return isIphoneX() ? 44 : 24;
  }

  if (skipAndroid) {
    return 0;
  }

  return StatusBar.currentHeight;
}

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}

type AlertType = {
  title?: string;
  subTitle?: string;
  handleClose?: () => void;
};

export function saveAndCloseAlert({title, subTitle, handleClose}: AlertType) {
  Alert.alert(
    title || 'Are you sure you want to exit this course?',
    subTitle || 'Exciting rewards awaits you after you finish the tutorial!',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: handleClose},
    ],
  );
}

// export async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   }
// }

export function dateToFromNowDaily(myDate: Date) {
  // ensure the date is displayed with today and yesterday
  return moment(myDate).calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
  });
}

export function secondsToHms(d: number) {
  if (d === 0) return '0 sec';
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? h + (h === 1 ? ' hr, ' : ' hrs, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' min, ' : ' mins, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' sec' : ' secs') : '';
  return hDisplay + mDisplay + sDisplay;
}

export const getGenericErrors = (error: any): string[] => {
  const inputFieldErrors = get(error, 'error');
  if (isEmpty(inputFieldErrors)) {
    return [];
  }

  // const genericFieldErrors = inputFieldErrors;
  // const genericFieldErrors = inputFieldErrors[0];
  return inputFieldErrors;
};

export const handleCheckCameraPermission = async () => {
  let permission: string = '';
  if (isIOS()) {
    permission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
  } else {
    permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  }
  if (permission === 'blocked') {
    return showAlertPermission();
  }
  return true;
};

export const handleGoToSettings = () => {
  if (isIOS()) {
    return Linking.openURL('app-settings:');
  }
  return Linking.openSettings();
};

export const showAlertPermission = (title?: string, subTitle?: string) => {
  Alert.alert(
    title || "Couldn't access photos",
    subTitle || 'Go to your device settings to allow access to photos',
    [{text: 'Cancel'}, {text: 'Open settings', onPress: handleGoToSettings}],
  );
};

export function validateNumberWithDecimal(value: string) {
  const re = /^(\d+)(,\d{1,2}|\.\d{1,2})?$/;
  return re.test(value);
}

export function formatDecimalNumber(value: string) {
  let newValue = value;
  newValue = value.replace(/[,+-\s]+/g, '.').replace(/(\..*)\./g, '$1');
  if (newValue.charAt(0) === '.') newValue = '0' + newValue;
  return newValue;
}

export function checkFieldIsEmpty(obj: any) {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === '') return true;
  }
  return false;
}

export function isEmptyValues(value: any) {
  return (
    value === undefined ||
    value === null ||
    value === NaN ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

export function validatePassword(password: string) {
  // const regex =
  //   /^(?=.*\d)(?=.*[!@#$%^£¥&*-+_{}:;[\]</~>=,-.])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  // const regex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%&*?])[A-Za-z\d@$!%&*?]{8,}$/;
  // return regex.test(password);
  return password?.length > 5;
}

export const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const getPathFile = (filePath: string) => {
  const fileAnroidPath = 'file://';
  const getPhotoURI = filePath?.includes(fileAnroidPath)
    ? filePath
    : fileAnroidPath + filePath;
  return getPhotoURI;
};

export const formatDate = (raw: string | number | Date) => {
  return format(new Date(raw), 'dd-MM-yyyy');
};

export const formatDateTime = (raw: string | number | Date) => {
  return format(new Date(raw), 'dd-MM-yyyy kk:mm');
};

export const generatePhoneNumber = (raw: PhoneNumber) => {
  if (!raw) {
    return '-';
  }
  return `+${raw.callingCode} ${raw.number}`;
};

export const calculateAsset = (number: number, decimal: number) => {
  let num = new BigNumber(number);
  let denom = new BigNumber(10).pow(decimal || 18);
  let ans = num.dividedBy(denom).toNumber();
  return ans;
};

export const calculateSendAsset = (number: number, decimal: number) => {
  let num = new BigNumber(number);
  let denom = new BigNumber(10).pow(decimal);
  let ans = num.multipliedBy(denom).toNumber();
  return ans;
};

export const calculateTokenBalance = (token: string, tokenList: Token[]) => {
  const findAddress = tokenList?.find(
    (item: any) => item?.address === customListTokens[token]?.address,
  );
  const balance = findAddress?.balance || 0;
  // const lockedBalance = findAddress?.lockedBalance || 0;
  const value = calculateAsset(+balance, customListTokens[token]?.decimals);
  // const lockedValue = calculateAsset(
  //   +lockedBalance,
  //   customListTokens[token]?.decimals,
  // );
  // const finalBalance = value - lockedValue;
  const finalBalance = value;
  return finalBalance?.toString();
};

export const checkValidAddress = (address: string, network: string) => {
  switch (network) {
    case 'erc20':
    case 'bep20':
      const regex = /^0x[a-fA-F0-9]{40}$/g;
      return regex.test(address);
    default:
      return;
  }
};

export const findSymbolByAddress = (address: string) => {
  const find = listTokens.find(item => item.address === address);
  return find?.symbol;
};

export const findTokenByAddress = (address: string) => {
  const find = listTokens.find(item => item.address === address);
  return find;
};

export const sortTokensArray = (arr: {symbol: string}[] = []) => {
  return listTokens.map(o => {
    return arr.find(i => i.symbol === o.symbol);
  });
};

export const handleGetTransType = (desc: string) => {
  if (desc?.includes('on-chain')) {
    return 'On-chain';
  }
  return 'Off-chain';
};

export const formatNumber = (raw?: string) => {
  if (!raw) {
    return 0;
  }
  const tmp = new BigNumber(raw).toFixed(18);
  const tmp1 = tmp.split('.');
  const lastestIndex = findLastIndex(tmp1[1], o => {
    return o !== '0';
  });

  if (lastestIndex === -1) {
    return tmp1[0];
  }

  return tmp1[0] + '.' + tmp1[1].slice(0, lastestIndex + 1);
};
