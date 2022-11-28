import Images from '../../../constants/Images';
import RouteKey from '../../../constants/RouteKey';

export const BASIC_SETTING = [
  {
    icon: Images.myProfileIcon,
    title: 'myProfile',
    hasArrowRight: true,
    route: RouteKey.MyProfileScreen,
  },
  {
    icon: Images.currencyIcon,
    title: 'baseCurrency',
    hasArrowRight: true,
    hasShowCurrency: true,
    currentCurrency: 'USDT',
  },
  {
    icon: Images.passwordIcon,
    title: 'changePassword',
    hasArrowRight: true,
    route: RouteKey.ChangePasswordScreen,
  },
  {
    icon: Images.referralIcon,
    title: 'referral',
    hasArrowRight: true,
  },
  {
    icon: Images.partnerIcon,
    title: 'myPartner',
    hasArrowRight: true,
  },
];

export const SECURITY = [
  {
    icon: Images.touchIDIcon,
    title: 'touchID',
    hasToggle: true,
    disabled: true,
    route: RouteKey.TouchIDScreen,
  },
  {
    icon: Images.kycIcon,
    title: 'accountVerificationKYC',
    hasArrowRight: true,
    route: RouteKey.KYCOnboardingScreen,
  },
];

export const OTHERS = [
  {
    icon: Images.aboutUsIcon,
    title: 'about',
    hasArrowRight: true,
    route: RouteKey.SettingScreen,
  },
  {
    icon: Images.helpCenterIcon,
    title: 'helpCenter',
    hasArrowRight: true,
    route: RouteKey.SettingScreen,
  },
  {
    icon: Images.termOfServiceIcon,
    title: 'termOfService',
    hasArrowRight: true,
    route: RouteKey.SettingScreen,
  },
  {
    icon: Images.policyIcon,
    title: 'privacyPolicy',
    hasArrowRight: true,
    route: RouteKey.SettingScreen,
  },
  {
    icon: Images.languageIcon,
    title: 'language',
    hasArrowRight: true,
    route: RouteKey.LanguageScreen,
  },
  {
    icon: Images.countryIcon,
    title: 'country',
    hasArrowRight: true,
    route: RouteKey.CountryScreen,
    params: {screenId: RouteKey.SettingScreen},
  },
  {
    icon: Images.hotlineIcon,
    isHotline: true,
    hasArrowRight: true,
  },
];

export const GROUP_EXCLUSIVE = [
  {icon: Images.messengerIcon, link: ''},
  {icon: Images.facebookIcon, link: ''},
  {icon: Images.telegramIcon, link: ''},
  {icon: Images.twitterIcon, link: ''},
];
