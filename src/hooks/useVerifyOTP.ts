import {useNavigation} from '@react-navigation/native';
import {useContext} from 'react';

import {localize} from '../assets/i18n/I18nConfig';
import RouteKey from '../constants/RouteKey';
import {LoadingContext} from '../context/LoadingContext';
import ToastEmitter from '../helpers/ToastEmitter';
import {User} from '../models/user';
import {generateOTP} from '../utils/Api/ApiManage';
import {SOMETHING_WENT_WRONG} from '../utils/Constants';
import {getGenericErrors} from '../utils/utils';
import {useGetMe} from './useQueries';

export const useVerifyOTP = () => {
  const navigation = useNavigation();
  const {setGlobalIndicator} = useContext(LoadingContext);

  const {data} = useGetMe();
  const profileData = data?.data as User;
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

  const onResendOTP = async () => {
    if (profileData?.email && !!profileData?.isEmailVerified) {
      await generateOTP('email');
      return;
    }
    if (profileData?.phoneNumber && !!profileData?.isPhoneVerified) {
      await generateOTP('sms');
      return;
    }
  };

  const verifyOTP = async onSuccess => {
    try {
      const isUseEmail = true;
      setGlobalIndicator(true);
      if (profileData?.email && !!profileData?.isEmailVerified) {
        await generateOTP('email');
        setGlobalIndicator(false);
        return navigation.navigate(RouteKey.VerifyOTPScreen, {
          isUseEmail,
          tempUsername: profileData?.email,
          onSuccess,
          onResend: onResendOTP,
        });
      }
      if (profileData?.phoneNumber && !!profileData?.isPhoneVerified) {
        await generateOTP('sms');
        setGlobalIndicator(false);
        return navigation.navigate(RouteKey.VerifyOTPScreen, {
          isUseEmail: !isUseEmail,
          tempUsername:
            '+' +
            profileData?.phoneNumber?.callingCode +
            profileData?.phoneNumber?.number,
          onSuccess,
          onResend: onResendOTP,
        });
      }

      ToastEmitter.error('Please verify phone or email to use this function');
      setGlobalIndicator(false);
    } catch (e) {
      setGlobalIndicator(false);
      showError(getGenericErrors(e), SOMETHING_WENT_WRONG);
    }
  };

  return {verifyOTP, onResendOTP};
};
