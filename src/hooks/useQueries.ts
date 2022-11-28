import {useContext} from 'react';
import {useMutation, useQuery} from 'react-query';
import {verticalScale} from 'react-native-size-matters';
import {localize} from '../assets/i18n/I18nConfig';
import Images from '../constants/Images';
import {responsiveHeight} from '../constants/Layout';
import {LoadingContext} from '../context/LoadingContext';
import ToastEmitter from '../helpers/ToastEmitter';
import {
  login,
  register,
  getMe,
  getWallet,
  getSupportListToken,
  getTokenPriceList,
  getFee,
} from '../utils/Api/ApiManage';
import {SOMETHING_WENT_WRONG} from '../utils/Constants';
import {getGenericErrors} from '../utils/utils';
import {ASSETS} from '../screens/Assets/components/Constants';
import LocalStorage from '../utils/LocalStorage';

const showError = (genericErrors: string[], message: string) => {
  if (genericErrors.length !== 0) {
    genericErrors.forEach(error => {
      const erroMessage = localize(error?.message);
      ToastEmitter.error(erroMessage);
    });
  } else {
    ToastEmitter.error(message);
  }
};

const showLoginError = (genericErrors: string[]) => {
  if (genericErrors.length !== 0) {
    genericErrors.forEach(error => {
      const erroMessage = localize(error?.message);
      ToastEmitter.modal({
        title: erroMessage || localize('userNameOrPasswordIsIncorrect'),
        icon: Images.errorIcon,
        iconStyle: {
          marginTop: responsiveHeight(20),
          width: verticalScale(60),
          height: verticalScale(60),
        },
      });
    });
  } else {
    ToastEmitter.modal({
      title: localize('userNameOrPasswordIsIncorrect'),
      icon: Images.errorIcon,
      iconStyle: {
        marginTop: responsiveHeight(20),
        width: verticalScale(60),
        height: verticalScale(60),
      },
    });
  }
};

export const useRegister = () => {
  const {setGlobalIndicator} = useContext(LoadingContext);
  return useMutation(register, {
    onError: err => {
      //Handle error
      showError(getGenericErrors(err), SOMETHING_WENT_WRONG);
    },
    onSettled: () => {
      setGlobalIndicator(false);
    },
  });
};

export const useMutate = (api: any) => {
  const {setGlobalIndicator} = useContext(LoadingContext);
  return useMutation(api, {
    onMutate: () => {
      setGlobalIndicator(true);
    },
    onError: err => {
      //Handle error
      console.log('[ERROR]', err);
      const TOO_MANY_REQUEST = 'Too many request';
      let messageError = SOMETHING_WENT_WRONG;
      if (err?.message === 'too_man_request') messageError = TOO_MANY_REQUEST;
      if (err?.message === 'error.buyer_cannot_be_seller')
        messageError = 'Buyer cannot be seller';
      showError(getGenericErrors(err), messageError);
    },
    onSettled: () => {
      setGlobalIndicator(false);
    },
  });
};

export const useLogin = () => {
  const {setGlobalIndicator} = useContext(LoadingContext);
  return useMutation(login, {
    onMutate: () => {
      setGlobalIndicator(true);
    },
    onError: err => {
      //Handle error
      showLoginError(getGenericErrors(err));
    },
    onSettled: () => {
      setGlobalIndicator(false);
    },
  });
};

export const useGetMe = () => {
  return useQuery('me', getMe);
};

const handleGetCurrentDigitalAsset = async () => {
  const currentDigitalAsset = await LocalStorage.getData('currentDigital');
  if (!currentDigitalAsset) {
    return ASSETS;
  }
  return currentDigitalAsset;
};

export const useGetCurrencyDigitalAsset = () => {
  return useQuery('digitalAsset', handleGetCurrentDigitalAsset);
};

export const useGetWallet = () => {
  return useQuery('wallet', getWallet, {refetchInterval: 10000});
};

export const useGetPrice = () => {
  return useQuery('tokenPrice', getSupportListToken, {refetchInterval: 10000});
};

export const useGetFee = () => {
  return useQuery('fee', getFee, {refetchInterval: 60000});
};

export const useGetCustomPrice = () => {
  return useQuery('customTokenPrice', getTokenPriceList, {
    refetchInterval: 30000,
  });
};
