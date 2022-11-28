import keyBy from 'lodash/keyBy';
import {Platform} from 'react-native';
import Images from '../constants/Images';
import RouteKey from '../constants/RouteKey';
import {buildEnv} from './Api/Env';

export const codePushKey: any = Platform.select({
  ios: {
    dev: '_t_tHWqGuZnBOsVm2qgKIKjuGM0SbQs3P8Agm',
    prod: 'VvsJDhc4pIs9_wLHB9INNictHFIcap-OWlLbO',
    staging: 'yhi2gU_b1LEL5dA1tGvH3j2OsrQ1HBVi2wuuw',
  },
  android: {
    dev: '3q3iRoC3X0ZMD6nyAB7sKLL2biLYaNn-Sq9X5',
    prod: 'sfl5uIw_wU3lWPFMZEd1Z4y2_CBEa5x5Wnmmb',
    staging: 'PjUOP3E1bDXNQ65gpLeM50xGLjdHgUej0jQhQ',
  },
});

export const SOMETHING_WENT_WRONG = 'Something went wrong!';
export const P2P_FEE_RATE = 0.001; // 0.1%

export const ErrorMessage = 'Something went wrong';
export const SHOW_TOAST = 'SHOW_TOAST';
export const TOAST_STATUS = {
  info: 'info',
  success: 'success',
  error: 'error',
};

type ErrorCodeType = {
  [opts: string]: string;
};

export const ErrorCode: ErrorCodeType = {
  option: 'Delivery method',
  surcharge: 'Fee',
  minimumSpending: 'Minimum spend',
};

export const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Use Password', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

export const DIGITAL_MENU = [
  {title: 'send', icon: Images.sendIcon},
  {
    title: 'receive',
    icon: Images.receiveIcon,
    route: RouteKey.ReceiveScreen,
  },
  {title: 'viewSMC', icon: Images.tradeIcon},
];

export const DIGITAL_OFFCHAIN_MENU = [{title: 'send', icon: Images.sendIcon}];

export const TOKEN_ADDRESS: any = {
  dev: {
    usdt: '0xD0823D0f7BdF3165eFcb8A0Ab2b5d09786ceAC92',
    bds: '0x14ae370Da5E530Bf3a7E47F31C8D0088258781c1',
    btg: '0xAd46F58C6a78acE0beb6b17b18A188aaB7BF5Ce5',
    btn: '',
    blc: '',
    bbp: '',
    bigg: '',
  },
  prod: {
    usdt: '0x55d398326f99059fF775485246999027B3197955',
    bds: '0x030ce78aa5be014976BcA9B8448e78d1d87FCe0B',
    btg: '0x7129ec085502Ae79eaaa75439fe1090C42F2E061',
    btn: '0x280f1638a642fa379e7cb8094411fc7fac919d70',
    blc: '0x15aC0a5240EDEd9c4B62112342dd808d59F88675',
    bbp: '0xEDC71903a97EeDC9d52C6b4bA116c45806478692',
    bigg: '0xf01A12B9f163fff4c7adA5D04cE7012847bBc5b4',
  },
};

export const listTokens = [
  {
    symbol: 'USDT',
    decimals: 18,
    address: TOKEN_ADDRESS[buildEnv].usdt,
  },
  {
    symbol: 'BTG',
    decimals: 18,
    address: TOKEN_ADDRESS[buildEnv].btg,
  },
  {
    symbol: 'BDS',
    decimals: 8,
    address: TOKEN_ADDRESS[buildEnv].bds,
  },
  {
    symbol: 'BLC',
    decimals: 8,
    address: TOKEN_ADDRESS[buildEnv].blc,
  },
  {
    symbol: 'BBP',
    decimals: 8,
    address: TOKEN_ADDRESS[buildEnv].bbp,
  },
  {
    symbol: 'BTN',
    decimals: 8,
    address: TOKEN_ADDRESS[buildEnv].btn,
  },
  {
    symbol: 'BIGG',
    decimals: 18,
    address: TOKEN_ADDRESS[buildEnv].bigg,
  },
];

export const customListTokens = keyBy(listTokens, 'symbol');

export const top_section = listTokens.slice(0, 3);
export const bot_section = listTokens.slice(3, 7);

const generateListTokensByAddress = () => {
  const result: {
    [key: string]: string;
  } = {};
  listTokens.forEach(res => {
    result[res.address as string] = res.symbol;
  });

  return result;
};
export const customListTokensByAddress = generateListTokensByAddress();

export const TOKEN_ICON = {
  BDS: {
    icon: Images.bdsIcon,
  },
  BIGG: {
    icon: Images.bigIcon,
  },
  BTG: {
    icon: Images.btgIcon,
  },
  BBP: {
    icon: Images.bbpIcon,
  },
  BTN: {
    icon: Images.btnIcon,
  },
  USDT: {
    icon: Images.usdtIcon,
  },
  BLC: {
    icon: Images.blcIcon,
  },
};
