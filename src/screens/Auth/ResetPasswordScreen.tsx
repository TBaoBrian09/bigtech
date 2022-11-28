/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import CustomInput from '../../common/CustomInput';
import Header from '../../common/Header';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useMutate} from '../../hooks/useQueries';
import {useShowError} from '../../hooks/useShowError';
import {ResetPasswordForm} from '../../models/form';
import {forgotPassword, resetPassword} from '../../utils/Api/ApiManage';
import {SOMETHING_WENT_WRONG} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {getGenericErrors, validatePassword} from '../../utils/utils';

const FORM = [
  {
    label: localize('phoneOrEmail'),
    key: 'emailOrPhone',
    placeholder: localize('inputEmailOrPhoneNumber'),
    secureTextEntry: false,
  },
  {
    label: localize('newPassword'),
    key: 'password',
    placeholder: localize('inputPassword'),
    secureTextEntry: true,
  },
  {
    label: 'OTP',
    key: 'otp',
    placeholder: localize('inputOTP'),
    secureTextEntry: false,
    keyboardType: 'number-pad',
  },
];
const TIMEOUT = 60;

const ResetPasswordScreen = (props: any) => {
  const {emailOrPhoneProps} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const [form, setForm] = useState<ResetPasswordForm>({
    emailOrPhone: '',
    password: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  const {mutate: handleForgot} = useMutate(forgotPassword);

  const blackText = useThemeColor('blackText');
  const grayText = useThemeColor('gray');
  const styles = getStyles(blackText, grayText);

  const {mutate: handleResetPassword} = useMutate(resetPassword);

  useEffect(() => {
    if (emailOrPhoneProps) setForm({...form, emailOrPhone: emailOrPhoneProps});
  }, [emailOrPhoneProps]);

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

  const handleShowPassword = () => setShowPassword(!showPassword);

  const checkPasswordValid = (key: string) => {
    if (
      !validatePassword(form?.password) &&
      key === 'password' &&
      form?.password
    )
      return localize('yourPassWordIsNotValid');
    return '';
  };

  const validateConfirm = () => {
    return form.password && form.emailOrPhone && form.otp;
  };

  const handleOnChangeText = (key: string) => (value: string) => {
    setForm({...form, [key]: value});
  };

  const handleSubmit = async () => {
    const body = {
      password: form.password,
      otp: form.otp,
      emailOrPhone: form.emailOrPhone,
    };
    handleResetPassword(body, {
      onSuccess: async () => {
        ToastEmitter.success(localize('changePasswordSuccess'));
        navigation.navigate(RouteKey.Login);
      },
    });
  };

  const resendOTP = async () => {
    handleForgot(
      {
        emailOrPhone: form?.emailOrPhone,
      } as unknown as void,
      {
        onSuccess: () => {
          ToastEmitter.success(localize('sendSuccess'));
          setTimeLeft(TIMEOUT);
        },
      },
    );
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <Header hasLeft={true} title={localize('resetPassword')} />
      <ScrollView>
        <View style={{flex: 1, marginTop: responsiveHeight(20)}}>
          {FORM?.map(item => (
            <CustomInput
              key={item.label}
              disabled={item?.key === 'emailOrPhone'}
              secureTextEntry={item?.key === 'password' && showPassword}
              label={item.label}
              value={form[item.key] || ''}
              placeholder={item.placeholder}
              customLabelStyle={{textTransform: 'capitalize'}}
              onChangeText={handleOnChangeText(item.key)}
              errorMessage={checkPasswordValid(item.key)}
              keyboardType={item?.keyboardType}
              maxLength={item?.key === 'otp' ? 6 : 40}
              hasRightIcon
              customRightIcon={
                item.key === 'password' && (
                  <Icon
                    tvParallaxProperties={false}
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    type="material"
                    color={primary.color}
                    onPress={handleShowPassword}
                  />
                )
              }
            />
          ))}
        </View>
        <Text style={styles.otpSubText}>
          {localize('haventReceivedAnyTheOtp')}
        </Text>
        <TouchableOpacity disabled={timeLeft > 0} onPress={resendOTP}>
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
      </ScrollView>
      <View style={{marginHorizontal: responsiveWidth(16)}}>
        <Button
          disabled={!validateConfirm()}
          title={localize('resetPassword')}
          onPress={handleSubmit}
          buttonStyle={[RootStyles.primaryButton, {marginBottom: 0}]}
          titleStyle={RootStyles.primaryButtonText}
        />
      </View>
    </Container>
  );
};

export default ResetPasswordScreen;

const getStyles = (blackText: string, grayText: string) =>
  StyleSheet.create({
    container: {flex: 1},
    title: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      marginBottom: responsiveHeight(33),
      marginTop: responsiveHeight(15),
      marginHorizontal: responsiveWidth(15),
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
