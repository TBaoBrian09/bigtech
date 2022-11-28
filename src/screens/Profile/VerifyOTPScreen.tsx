/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useQueryClient} from 'react-query';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import OTPItem from '../../common/OTPItem';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {LoadingContext} from '../../context/LoadingContext';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useShowError} from '../../hooks/useShowError';
import {
  resendOTP,
  verifyEmailOTP,
  verifyPhoneOTP,
} from '../../utils/Api/ApiManage';
import {SOMETHING_WENT_WRONG} from '../../utils/Constants';
import {getGenericErrors} from '../../utils/utils';

interface VerifyOTPScreenProps {
  route?: any;
}

const OTP = [0, 1, 2, 3, 4, 5];
const MAX_LENGTH = 6;
const TIMEOUT = 60;
const ITEM_WIDTH =
  (Layout.window.width -
    responsiveWidth(60) -
    (MAX_LENGTH - 1) * responsiveWidth(10)) /
  MAX_LENGTH;

const VerifyOTPScreen = (props: VerifyOTPScreenProps) => {
  const {isUseEmail, tempUsername, onSuccess, onResend} =
    props?.route?.params ?? {};
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<boolean>(false);

  const textRef = useRef<TextInput>(null);

  const {setGlobalIndicator} = useContext(LoadingContext);
  const {showError} = useShowError();
  const grayText = useThemeColor('gray');
  const blackText = useThemeColor('blackText');

  const styles = getStyles(blackText, grayText);

  const title = isUseEmail
    ? `${localize('pleaseFillYourEmailOTP')} ${tempUsername}`
    : `${localize('pleaseFillYourPhoneOTP')} (${tempUsername})`;

  useEffect(() => {
    setTimeLeft(TIMEOUT);
  }, []);

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    if (code.length === MAX_LENGTH) {
      handleValidateOTP();
    }
    return () => {};
  }, [code]);

  const handleValidateOTP = async () => {
    try {
      if (onSuccess) {
        return onSuccess(code);
      }
      setGlobalIndicator(true);
      let res;
      if (isUseEmail) {
        res = await verifyEmailOTP(code);
      } else {
        res = await verifyPhoneOTP(code);
      }
      setGlobalIndicator(false);
      if (res?.status === 204) {
        queryClient.invalidateQueries('me');
        ToastEmitter.success(localize('success'));
        return navigation.navigate(route || RouteKey.MyProfileScreen);
      }
    } catch (e) {
      setGlobalIndicator(false);
      showError(getGenericErrors(e), SOMETHING_WENT_WRONG);
    }
  };

  const handleChangeCode = (text: string) => {
    setError(false);
    if (text.length < MAX_LENGTH + 1) {
      return setCode(text);
    }
  };

  const handleResendCode = async () => {
    try {
      if (!timeLeft) {
        if (onResend) {
          onResend();
        } else {
          await resendOTP(isUseEmail);
        }
        setTimeLeft(TIMEOUT);
        ToastEmitter.success(localize('resendSuccess'));
      }
    } catch (e) {
      console.log('resend error', e);
      showError(getGenericErrors(e), SOMETHING_WENT_WRONG);
    }
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <Header
        hasLeft={true}
        title={isUseEmail ? localize('email') : localize('phoneNumber')}
      />
      <View style={styles.wrapper}>
        <Text style={[styles.title, {textAlign: 'center'}]}>{title}</Text>
        <View style={styles.textInputWrapper}>
          <TextInput
            blurOnSubmit={false}
            autoFocus={true}
            textContentType="oneTimeCode"
            keyboardType="number-pad"
            value={code}
            ref={textRef}
            style={styles.inputStyle}
            onChangeText={text => handleChangeCode(text)}
            maxLength={MAX_LENGTH}
            onSubmitEditing={() => {}}
            secureTextEntry={true}
          />
          {OTP.map(item => {
            return (
              <OTPItem
                textStyle={error && {color: '#E92727'}}
                style={{width: ITEM_WIDTH, height: ITEM_WIDTH}}
                key={item}
                code={code}
                index={item}
                onPress={() => {
                  textRef?.current?.focus();
                }}
              />
            );
          })}
        </View>
        <Text style={styles.otpSubText}>
          {localize('haventReceivedAnyTheOtp')}
        </Text>
        <TouchableOpacity disabled={timeLeft > 0} onPress={handleResendCode}>
          <Text
            style={[
              timeLeft > 0 ? styles.resendTextNoActive : styles.resendText,
              {color: timeLeft > 0 ? grayText : primary.color},
            ]}>
            {timeLeft
              ? `${localize('resend')} (${timeLeft})`
              : localize('resend')}
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default VerifyOTPScreen;

const getStyles = (blackText: string, grayText: string) =>
  StyleSheet.create({
    container: {},
    wrapper: {
      width: Layout.window.width,
      paddingHorizontal: responsiveWidth(16),
    },
    inputStyle: {width: 0, height: 0, position: 'absolute'},
    textInputWrapper: {
      marginBottom: responsiveHeight(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: responsiveWidth(15),
    },
    title: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: grayText,
    },
    otpSubText: {
      marginTop: responsiveHeight(40),
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      textAlign: 'center',
    },
    resendTextNoActive: {
      fontSize: typographies.subhead,
      fontWeight: 'bold',
      color: grayText,
      textAlign: 'center',
      marginTop: responsiveHeight(5),
    },
    resendText: {
      fontSize: typographies.subhead,
      fontWeight: 'bold',
      color: grayText,
      textAlign: 'center',
      textDecorationLine: 'underline',
      marginTop: responsiveHeight(5),
    },
  });
