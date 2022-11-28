/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Button, Input, Icon as RNIcon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {isValidPhoneNumber} from 'libphonenumber-js';

import {primary, white} from '../../constants/Colors';
import Layout, {
  isIOS,
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import typographies from '../../constants/Typographies';
import {useThemeColor} from '../../common/Themed';
import Container from '../../common/Container';
import Header from '../../common/Header';
import {UserRegister} from '../../models/user';
import {LoadingContext} from '../../context/LoadingContext';
import OTPItem from '../../common/OTPItem';
import RouteKey from '../../constants/RouteKey';
import RootStyles from '../../utils/styles';
import Fonts from '../../constants/Fonts';
import Icon from '../../common/Icon';
import Images from '../../constants/Images';
import {
  getGenericErrors,
  validateEmail,
  validatePassword,
} from '../../utils/utils';
import {localize} from '../../assets/i18n/I18nConfig';
import {useRegister} from '../../hooks/useQueries';
import {
  resendOTP,
  verifyEmailOTP,
  verifyPhoneOTP,
} from '../../utils/Api/ApiManage';
import ToastEmitter from '../../helpers/ToastEmitter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useShowError} from '../../hooks/useShowError';
import {SOMETHING_WENT_WRONG} from '../../utils/Constants';
import {verticalScale} from 'react-native-size-matters';

const OTP = [0, 1, 2, 3, 4, 5];
const MAX_LENGTH = 6;
const TIMEOUT = 60;
const ITEM_WIDTH =
  (Layout.window.width -
    responsiveWidth(60) -
    (MAX_LENGTH - 1) * responsiveWidth(10)) /
  MAX_LENGTH;

const RegisterScreen = (props: any) => {
  const {screenId, scrollId, userName, isUseEmailProp, country, dial} =
    props?.route?.params ?? {};
  const dialCode = dial || '+84';
  const navigation = useNavigation();
  const {setGlobalIndicator} = useContext(LoadingContext);
  const grayText = useThemeColor('gray');
  const blackText = useThemeColor('blackText');

  const styles = getStyles(blackText, grayText);

  const [showPassword, setShowPassword] = useState(true);
  const [focusInput, setFocusInput] = useState('');
  const [scrollIdx, setScrollIdx] = useState(0);
  const [form, setForm] = useState<any>({
    name: '',
    username: '',
    password: '',
  });
  const [isUseEmail, setUseEmail] = useState(false);
  const [code, setCode] = React.useState<string>('');
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [error, setError] = React.useState<boolean>(false);
  const [tempUsername, setTempUserName] = useState<string>('');

  const scrollViewRef = useRef<any>();
  const textRef = useRef<TextInput>(null);

  const {mutate: handleRegister} = useRegister();
  const {showError} = useShowError();

  useEffect(() => {
    if (scrollId) {
      setScrollIdx(scrollId);
      setUseEmail(isUseEmailProp);
      handleResendCodeProp();
    }
  }, [scrollId]);

  useEffect(() => {
    if (scrollIdx === 2) setTimeLeft(TIMEOUT);
  }, [scrollIdx]);

  useEffect(() => {
    if (country) {
      setForm({...form, country});
    }
  }, [country]);

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

  const checkUserNameValid = useMemo<string>(() => {
    if (isUseEmail && !validateEmail(form.username) && form.username)
      return localize('yourEmailIsNotValid');
    if (
      !isUseEmail &&
      !isValidPhoneNumber(form.username, country) &&
      form.username
    )
      return localize('yourPhoneNumberIsNotValid');
    return '';
  }, [form, isUseEmail]);

  const checkPasswordValid = useMemo<string>(() => {
    if (!validatePassword(form?.password) && form?.password)
      return localize('yourPassWordIsNotValid');
    return '';
  }, [form]);

  /**
   * =============================================
   * Functions & Events
   * =============================================
   */
  const handleOnChangeText = (key: string) => (value: string) => {
    setForm({...form, [key]: value});
  };

  const handleChangeCode = (text: string) => {
    setError(false);
    if (text.length < MAX_LENGTH + 1) {
      return setCode(text);
    }
  };

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleFocusInput = (type: string) => () => setFocusInput(type);

  const handleGoBack = async () => {
    await AsyncStorage.removeItem('token');
    if (screenId) {
      return navigation.navigate(screenId);
    }
    if (scrollIdx) {
      const backIdx = scrollIdx - 1;
      handleNextPage(backIdx);
      setCode('');
      return;
    }
    navigation.goBack();
  };

  const handleNextPage = (idx: number) => {
    setScrollIdx(idx);
    scrollViewRef.current?.scrollTo({
      x: idx ? Layout.window.width * idx + 1 : 0,
      y: 0,
      animated: true,
    });
  };

  const handleResendCodeProp = async () => {
    try {
      await resendOTP(isUseEmailProp);
      setTimeLeft(TIMEOUT);
    } catch (e) {
      console.log('resend error', e);
      showError(getGenericErrors(e), SOMETHING_WENT_WRONG);
    }
  };

  const handleResendCode = async () => {
    try {
      if (!timeLeft) {
        await resendOTP(isUseEmail);
        setTimeLeft(TIMEOUT);
        ToastEmitter.success(localize('resendSuccess'));
      }
    } catch (e) {
      console.log('resend error', e);
      showError(getGenericErrors(e), SOMETHING_WENT_WRONG);
    }
  };

  const handleChangeUserNameType = () => {
    setUseEmail(!isUseEmail);
    setForm({...form, username: ''});
  };

  const onSubmitRegister = async () => {
    let body: UserRegister = {
      password: form.password,
      profile: {
        name: form.name,
        country: form.country,
      },
    };
    if (!isUseEmail) {
      body = {...body, phoneNumber: dialCode + form.username};
    } else {
      body = {...body, email: form.username};
    }
    handleRegister(body, {
      onSuccess: async res => {
        await AsyncStorage.setItem('token', res?.data?.token);
        handleNextPage(2);
        const tempPhoneNumber =
          res?.data?.user?.phoneNumber?.callingCode === '84' ? '0' : '';
        setTempUserName(
          isUseEmail
            ? res?.data?.user?.email
            : tempPhoneNumber + res?.data?.user?.phoneNumber?.number,
        );
      },
    });
  };

  const handleValidateOTP = async () => {
    try {
      setGlobalIndicator(true);
      let res;
      if (isUseEmail) {
        res = await verifyEmailOTP(code);
      } else {
        res = await verifyPhoneOTP(code);
      }
      setGlobalIndicator(false);
      if (res?.status === 204) {
        ToastEmitter.success(localize('registerSuccess'));
        return navigation.navigate(RouteKey.VerifySuccessScreen, {
          isUseEmail,
          tempUsername,
        });
      }
    } catch (e) {
      setGlobalIndicator(false);
      showError(getGenericErrors(e), SOMETHING_WENT_WRONG);
    }
  };

  /**
   * =============================================
   * renderUI
   * =============================================
   */
  const renderFirstPage = () => {
    return (
      <View style={styles.wrapper}>
        <View style={styles.wrapeprContent}>
          <Text style={styles.header}>{localize('whatIsYourName')}</Text>
          <Text style={styles.title}>
            {localize('pleaseEnterYourFullName')}
          </Text>
          <Input
            containerStyle={[
              styles.inputContainer,
              {marginTop: responsiveHeight(30)},
            ]}
            inputContainerStyle={
              focusInput === 'name' && {borderBottomColor: primary.color}
            }
            value={form.name}
            onChangeText={handleOnChangeText('name')}
            autoCompleteType={false}
            onFocus={handleFocusInput('name')}
            autoCorrect={false}
            autoCapitalize="none"
            inputStyle={styles.input}
            placeholder={localize('fullName')}
          />
        </View>
        <Button
          disabled={!form.name || form.name.length < 3}
          title={localize('continue')}
          disabledStyle={styles.buttonDisabled}
          onPress={() => handleNextPage(1)}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
    );
  };

  const renderSecondPage = () => {
    return (
      <View style={styles.wrapper}>
        <View style={styles.wrapeprContent}>
          <Text style={styles.header}>{localize('signUp')}</Text>
          <Text style={styles.highlightTitle}>
            {localize('useThePhoneNumberOrEmail')}
          </Text>
          <View style={{marginTop: responsiveHeight(30)}}>
            <TouchableOpacity
              style={RootStyles.alignSelfEnd}
              onPress={handleChangeUserNameType}>
              <Text style={styles.highlightTitle}>
                {isUseEmail ? localize('usePhoneNumber') : localize('useEmail')}
              </Text>
            </TouchableOpacity>
            <Input
              containerStyle={styles.inputContainer}
              inputContainerStyle={
                focusInput === 'username' && {borderBottomColor: primary.color}
              }
              keyboardType={isUseEmail ? 'email-address' : 'phone-pad'}
              value={form.username}
              onChangeText={handleOnChangeText('username')}
              autoCompleteType={false}
              onFocus={handleFocusInput('username')}
              autoCorrect={false}
              autoCapitalize="none"
              inputStyle={styles.input}
              maxLength={isUseEmail ? 40 : 18}
              placeholder={
                isUseEmail
                  ? localize('enterEmail')
                  : localize('enterThePhoneNumber')
              }
              leftIcon={
                <View style={RootStyles.rowStyle}>
                  <Icon
                    source={isUseEmail ? Images.email : Images.phoneIcon}
                    size={verticalScale(18)}
                    style={{marginRight: verticalScale(4)}}
                    color={primary.color}
                  />
                  {!isUseEmail && (
                    <Text style={styles.dialogText}>{dialCode}</Text>
                  )}
                </View>
              }
              errorMessage={checkUserNameValid}
            />
            <Input
              containerStyle={styles.inputContainer}
              inputContainerStyle={
                focusInput === 'password' && {borderBottomColor: primary.color}
              }
              value={form.password}
              onChangeText={handleOnChangeText('password')}
              onFocus={handleFocusInput('password')}
              autoCompleteType={false}
              autoCorrect={false}
              autoCapitalize="none"
              inputStyle={styles.input}
              secureTextEntry={showPassword}
              placeholder={localize('enterAStrongPassword')}
              leftIcon={
                <Icon
                  source={Images.passwordIcon}
                  size={verticalScale(18)}
                  style={{marginRight: verticalScale(10)}}
                  color={primary.color}
                />
              }
              rightIcon={
                <RNIcon
                  tvParallaxProperties={false}
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  type="material"
                  color={primary.color}
                  onPress={handleShowPassword}
                />
              }
              errorMessage={checkPasswordValid}
            />
          </View>
        </View>
        <Button
          disabled={
            !!checkUserNameValid ||
            !!checkPasswordValid ||
            !form.password ||
            !form.username
          }
          title={localize('signUp')}
          disabledStyle={styles.buttonDisabled}
          onPress={onSubmitRegister}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
    );
  };

  const renderThirdPage = () => {
    const phoneNumber = userName || dialCode + ' ' + form.username;
    const title = isUseEmail
      ? `${localize('pleaseFillYourEmailOTP')} ${userName || form.username}`
      : `${localize('pleaseFillYourPhoneOTP')} (${phoneNumber})`;
    return (
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
    );
  };

  const renderPage = () => {
    if (scrollIdx === 0) return renderFirstPage();
    if (scrollIdx === 1) return renderSecondPage();
    return renderThirdPage();
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}>
      <Header
        hasLeft
        iconLeftColor={primary.color}
        onPressLeft={handleGoBack}
        title={
          scrollIdx === 2
            ? isUseEmail
              ? localize('verifyEmail')
              : localize('verifyPhoneNumber')
            : ''
        }
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={isIOS() ? 'padding' : undefined}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          scrollEventThrottle={200}
          contentContainerStyle={styles.contentContainerStyle}
          decelerationRate={0}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled={false}>
          {renderPage()}
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const getStyles = (blackText: string, grayText: string) =>
  StyleSheet.create({
    container: {flex: 2},
    wrapper: {
      width: Layout.window.width,
      paddingHorizontal: responsiveWidth(16),
    },
    wrapeprContent: {flex: 1},
    contentContainerStyle: {paddingTop: responsiveHeight(20)},
    header: {
      fontSize: typographies.h3,
      color: blackText,
      fontFamily: Fonts.montserratBold,
      marginBottom: responsiveHeight(10),
    },
    image: {
      width: responsiveWidth(16),
      height: responsiveWidth(16),
      borderRadius: responsiveWidth(20),
      marginRight: responsiveWidth(5),
    },
    button: {
      marginTop: responsiveHeight(40),
      minHeight: responsiveHeight(40),
      paddingVertical: responsiveHeight(5),
      borderRadius: responsiveWidth(6),
      backgroundColor: primary.color,
      marginBottom: responsiveHeight(15),
    },
    buttonDisabled: {backgroundColor: primary.color, opacity: 0.7},
    buttonTitle: {
      fontSize: typographies.body,
      color: white,
      fontFamily: Fonts.montserratMedium,
    },
    inputContainer: {paddingHorizontal: 0},
    input: {
      fontSize: typographies.subhead,
      color: blackText,
      fontFamily: Fonts.montserratMedium,
    },
    textInputWrapper: {
      marginBottom: responsiveHeight(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: responsiveWidth(15),
    },
    inputStyle: {width: 0, height: 0, position: 'absolute'},
    title: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: grayText,
    },
    highlightTitle: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: primary.color,
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
    otpSubText: {
      marginTop: responsiveHeight(40),
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      textAlign: 'center',
    },
    dialogText: {
      fontSize: typographies.subhead,
      color: primary.color,
      fontFamily: Fonts.montserratMedium,
    },
  });

export default RegisterScreen;
