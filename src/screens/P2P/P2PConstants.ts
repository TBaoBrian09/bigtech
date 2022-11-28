import {KeyboardType} from 'react-native';
import Images from '../../constants/Images';
import {CreateOrderFormInput} from '../../models/form';

export const CREATE_ORDER_FORM: CreateOrderFormInput[] = [
  {
    key: 'amount',
    label: 'amount',
    rightLabel: 'USDT',
    hasMax: true,
    keyboardType: 'numeric',
    type: 'amount',
  },
  {
    key: 'type',
    label: 'priceType',
    disabled: true,
    editable: false,
    hasCustomRightIcon: true,
    type: 'button',
  },
  {
    key: 'price',
    label: 'unitPrice',
    rightLabel: 'USDT',
    keyboardType: 'numeric',
    type: 'price',
  },
  {
    key: 'subTotal',
    label: 'subTotal',
    rightLabel: 'USDT',
    editable: false,
  },
  {
    key: 'fee',
    label: 'fee',
    rightLabel: 'USDT',
    editable: false,
  },
  {
    key: 'total',
    label: 'total',
    rightLabel: 'USDT',
    editable: false,
  },
];

export const BUY_SELL_FORM = [
  {
    key: 'amount',
    label: 'amount',
    rightLabel: 'token',
    keyboardType: 'numeric' as KeyboardType,
    hasMax: true,
  },
  {
    key: 'subTotal',
    editable: false,
    label: 'subTotal',
    rightLabel: 'USDT',
  },
  {
    key: 'fee',
    editable: false,
    label: 'fee',
    rightLabel: 'fee',
  },
  {
    key: 'total',
    editable: false,
    label: 'total',
    rightLabel: 'USDT',
  },
];

export const P2P_TOKENS = [
  {
    title: 'BTG',
    subTitle: 'Big Tech Global',
    icon: Images.btgIcon,
    token: 'btg',
    isActive: true,
    id: 2,
  },
  {
    title: 'BLC',
    subTitle: 'Big Lao Cai',
    icon: Images.blcIcon,
    token: 'blc',
    isActive: true,
    id: 3,
  },
  {
    title: 'BBP',
    subTitle: 'Big Binh Phuoc',
    icon: Images.bbpIcon,
    token: 'bbp',
    isActive: true,
    id: 4,
  },
  {
    title: 'BTN',
    subTitle: 'Big Tay Ninh',
    icon: Images.btnIcon,
    token: 'btn',
    isActive: true,
    id: 5,
  },
];

export const ACTIONS = ['buy', 'sell', 'all'];
