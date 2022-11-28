import Images from '../../../constants/Images';

export const ALL_ASSETS = [
  {
    title: 'BTG',
    subTitle: 'Big Tech Global',
    icon: Images.btgIcon,
    token: 'btg',
    isActive: true,
  },
  {
    title: 'BLC',
    subTitle: 'Big Lao Cai',
    icon: Images.blcIcon,
    token: 'blc',
    isActive: true,
  },
  {
    title: 'BBP',
    subTitle: 'Big Binh Phuoc',
    icon: Images.bbpIcon,
    token: 'bbp',
    isActive: true,
  },
  {
    title: 'BTN',
    subTitle: 'Big Tay Ninh',
    icon: Images.btnIcon,
    token: 'btn',
    isActive: true,
  },
  {
    title: 'USDT',
    subTitle: 'Tether',
    icon: Images.usdtIcon,
    token: 'usdt',
    isActive: true,
    isUsdt: true,
  },
];

const digitalAssets = ['usdt', 'btg', 'bbp', 'btn', 'blc'];
export const ASSETS = ALL_ASSETS.filter(o => digitalAssets.includes(o.token));
