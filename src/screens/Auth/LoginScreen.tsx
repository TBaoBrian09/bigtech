/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
  // NativeModules,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Input, Icon as RNIcon} from 'react-native-elements';
import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {verticalScale} from 'react-native-size-matters';

import Layout, {
  isIOS,
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import {linearGradientPrimary, primary, white} from '../../constants/Colors';
import {validateEmail, validatePassword} from '../../utils/utils';
import Container from '../../common/Container';
import typographies from '../../constants/Typographies';
import {useThemeColor} from '../../common/Themed';
import {UserLogin, UserLoginAPI} from '../../models/user';
import Images from '../../constants/Images';
import RouteKey from '../../constants/RouteKey';
import Fonts from '../../constants/Fonts';
import Icon from '../../common/Icon';
import ToastEmitter from '../../helpers/ToastEmitter';
import {localize, setLocale} from '../../assets/i18n/I18nConfig';
import {LanguageContext} from '../../context/LanguageContext';
import RootStyles from '../../utils/styles';
import {useLogin} from '../../hooks/useQueries';
import {NavigationRoot} from '../../navigation/root';
import LanguageButton from './components/LanguageButton';
import {optionalConfigObject} from '../../utils/Constants';
import LocalStorage from '../../utils/LocalStorage';
import {getSupportListToken, getWallet} from '../../utils/Api/ApiManage';
import {UserContext} from '../../context/UserContext';
import {LoadingContext} from '../../context/LoadingContext';
import {buildEnv, version} from '../../utils/Api/Env';
import FCMServices from '../../utils/Notification/FCMServices';
import GradientButton from '../../common/GradientButton';

const LoginScreen = (props: any) => {
  const {tempUsername, tempIsUseEmail} = props?.route?.params ?? {};
  const navigation = useNavigation<any>();

  const lightGreenText = useThemeColor('lightGreenText');
  const blackText = useThemeColor('blackText');
  const blueText = useThemeColor('blueText');

  const styles = getStyles(lightGreenText, blueText, blackText);

  const [showPassword, setShowPassword] = useState(true);
  const [focusInput, setFocusInput] = useState('');
  const [form, setForm] = useState<UserLogin>({
    username: __DEV__ ? 'jinx.dev.19xx+1@gmail.com' : '',
    password: __DEV__ ? '123456' : '',
  });
  const [hasBiometric, setHasBiometric] = useState('');
  const [biometricType, setBioMetricType] = useState<string>('');
  const [isUseEmail, setUseEmail] = useState(__DEV__ ? true : false);

  const {languageState} = useContext(LanguageContext);
  const {setUserData} = useContext(UserContext);
  const {setGlobalIndicator} = useContext(LoadingContext);

  const {mutate: handleLoginMutate} = useLogin();

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  useEffect(() => {
    if (tempUsername && tempIsUseEmail) {
      setForm({...form, username: tempUsername});
      setUseEmail(tempIsUseEmail);
    }
  }, [tempUsername, tempIsUseEmail]);

  useEffect(() => {
    handleCheckHasBiometric();
  }, []);

  useEffect(() => {
    setLocale(languageState);
  }, []);

  const backAction = () => {
    return true;
  };

  const checkUserNameValid = useMemo<string>(() => {
    if (isUseEmail && !validateEmail(form.username) && form.username)
      return localize('yourEmailIsNotValid');
    if (!isUseEmail && form.username.length < 5 && form.username)
      return localize('yourPhoneNumberIsNotValid');
    return '';
  }, [form, isUseEmail]);

  const checkPasswordValid = useMemo<string>(() => {
    if (!validatePassword(form.password) && form.password)
      return localize('yourPassWordIsNotValid');
    return '';
  }, [form]);

  /**
   * =============================================
   * Functions & Events
   * =============================================
   */

  const handleCheckHasBiometric = async () => {
    const savedAccount = await LocalStorage.getData('savedAccount');
    if (savedAccount) {
      const check = await TouchID.isSupported();
      setHasBiometric(check);
      setBioMetricType(check);
    }
  };

  // const passcodeHandler = async () => {
  //   try {
  //     const checkPasscode = await NativeModules?.PasscodeAuth?.authenticate(
  //       'to demo this react-native component',
  //     );
  //     console.log('checkPasscode', checkPasscode);
  //     // if (checkPasscode) {
  //     //   const savedAccount = await LocalStorage.getData('savedAccount');
  //     //   let body: UserLoginAPI = {
  //     //     password: savedAccount.password,
  //     //   };
  //     //   if (savedAccount?.email) {
  //     //     body = {...body, email: savedAccount?.email};
  //     //   } else {
  //     //     body = {...body, phoneNumber: savedAccount?.phoneNumber};
  //     //   }
  //     //   handleLoginMutate(body, {
  //     //     onSuccess: async res => {
  //     //       await AsyncStorage.setItem('token', res?.data?.token);
  //     //       await AsyncStorage.setItem('user', JSON.stringify(res?.data?.user));
  //     //       NavigationRoot.main();
  //     //     },
  //     //   });
  //     // }
  //     // .then(success => {
  //     //   // Success code
  //     // })
  //     // .catch(error => {
  //     //   // Failure code
  //     // });
  //   } catch (e) {
  //     ToastEmitter.error('Authentication Failed');
  //   }
  // };

  const handleUpdateUserdata = async () => {
    try {
      setGlobalIndicator(true);
      const resUserAmount = await getWallet();
      const resPrice = await getSupportListToken();
      const priceToken = resPrice?.data?.reduce(
        (obj: any, cur: any) => ({...obj, [cur?.address]: cur}),
        {},
      );
      setUserData({
        ...resUserAmount?.data,
        priceToken,
      });
      setGlobalIndicator(false);
      NavigationRoot.main();
    } catch (e) {
      setGlobalIndicator(false);
    }
  };

  const verifyBiometric = async () => {
    try {
      const resBiometric = await TouchID.authenticate('', optionalConfigObject);
      if (resBiometric) {
        const savedAccount = await LocalStorage.getData('savedAccount');
        let body: UserLoginAPI = {
          password: savedAccount.password,
        };
        if (savedAccount?.email) {
          body = {...body, email: savedAccount?.email};
        } else {
          body = {...body, phoneNumber: savedAccount?.phoneNumber};
        }
        handleLoginMutate(body, {
          onSuccess: async res => {
            await AsyncStorage.setItem('token', res?.data?.token);
            await AsyncStorage.setItem('user', JSON.stringify(res?.data?.user));
            handleUpdateUserdata();
          },
          onError: () => {
            setGlobalIndicator(false);
          },
        });
      }
    } catch (e) {
      console.log('e', e);
    }
  };

  const handleOnChangeText = (key: string) => (value: string) => {
    setForm({...form, [key]: value});
  };

  const handleChangeUserNameType = () => {
    setUseEmail(!isUseEmail);
    setForm({...form, username: ''});
  };

  const getDeviceToken = async () => {
    let granted = false;
    const deviceToken = await FCMServices.getToken();
    try {
      granted = await FCMServices.hasPermission();
      if (granted) {
        return deviceToken;
      }
      if (!granted) {
        granted = await FCMServices.requestPermission();
        if (granted) {
          return deviceToken;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogin = async () => {
    try {
      const deviceToken = await getDeviceToken();
      let body: UserLoginAPI = {
        password: form.password,
        deviceId: deviceToken,
      };
      if (!isUseEmail) {
        const vnDialCode = '+84';
        let phoneNumber = form.username;
        if (!phoneNumber.includes('+')) {
          phoneNumber = vnDialCode + phoneNumber;
        }
        body = {...body, phoneNumber: phoneNumber};
      } else {
        body = {...body, email: form.username};
      }
      handleLoginMutate(body, {
        onSuccess: async res => {
          await AsyncStorage.setItem('token', res?.data?.token);
          if (
            !res?.data?.user?.isEmailVerified &&
            !res?.data?.user?.isPhoneVerified
          ) {
            return navigation.navigate(RouteKey.Register, {
              screenId: RouteKey.Login,
              scrollId: 2,
              isUseEmailProp: isUseEmail,
              userName: form.username,
            });
          }
          await AsyncStorage.setItem('user', JSON.stringify(res?.data?.user));

          const savedAccount = await LocalStorage.getData('savedAccount');
          if (savedAccount) {
            if (savedAccount?.id !== res?.data?.user?.id) {
              AsyncStorage.removeItem('savedAccount');
            }
          }
          handleUpdateUserdata();
        },
        onError: err => {
          console.log(err);
          setGlobalIndicator(false);
          ToastEmitter.modal({
            title: localize('userNameOrPasswordIsIncorrect'),
            icon: Images.errorIcon,
            iconStyle: {
              marginTop: responsiveHeight(20),
              width: verticalScale(60),
              height: verticalScale(60),
            },
          });
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleFocusInput = (type: string) => () => setFocusInput(type);

  const handleNavigateRegister = () => {
    navigation.navigate(RouteKey.RegisterOnboardScreen);
  };

  /**
   * =============================================
   * Render UI
   * =============================================
   */

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <ScrollView>
        {/* <KeyboardAvoidingView
          style={styles.container}
          behavior={isIOS() ? 'padding' : undefined}> */}
        <View style={{paddingHorizontal: responsiveWidth(16)}}>
          <LanguageButton
            style={{
              marginBottom: responsiveHeight(30),
              marginTop: responsiveHeight(15),
            }}
          />
          <View style={styles.iconWrapper}>
            <Icon source={Images.loginBanner} style={styles.icon} />
          </View>
          <Text style={styles.header}>{localize('signIn')}</Text>
          <Text style={styles.title}>
            {localize('dontHaveAnAccount')}{' '}
            <Text
              style={styles.highlightTitle}
              onPress={handleNavigateRegister}>
              {localize('signUpNow')}
            </Text>
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
                focusInput === 'username' && {
                  borderBottomColor: primary.color,
                }
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
                    size={verticalScale(16)}
                    style={{marginRight: responsiveWidth(4)}}
                    color={primary.color}
                  />
                </View>
              }
              errorMessage={checkUserNameValid}
            />
            <Input
              containerStyle={styles.inputContainer}
              inputContainerStyle={
                focusInput === 'password' && {
                  borderBottomColor: primary.color,
                }
              }
              value={form.password}
              onChangeText={handleOnChangeText('password')}
              onFocus={handleFocusInput('password')}
              autoCompleteType={false}
              autoCorrect={false}
              autoCapitalize="none"
              inputStyle={styles.input}
              secureTextEntry={showPassword}
              placeholder={localize('inputPassword')}
              leftIcon={
                <RNIcon
                  tvParallaxProperties={false}
                  name="lock"
                  type="material"
                  color={primary.color}
                  style={{marginRight: responsiveWidth(10)}}
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

          <TouchableOpacity
            onPress={() => navigation.navigate(RouteKey.ForgotPasswordScreen)}>
            <Text style={[styles.highlightTitle, {textAlign: 'center'}]}>
              {localize('forgotPassword')}
            </Text>
          </TouchableOpacity>

          <GradientButton
            title={localize('signIn')}
            onPress={handleLogin}
            style={styles.loginButton}
            titleStyle={styles.loginButtonText}
            colors={linearGradientPrimary}
          />
          {!!hasBiometric && (
            <View style={{marginBottom: responsiveHeight(20)}}>
              <Icon
                source={
                  biometricType === 'FaceID'
                    ? Images.faceIdIcon
                    : Images.touchIcon
                }
                style={styles.faceIdIcon}
                color={blackText}
                onPress={verifyBiometric}
              />
              {biometricType === 'TouchID' && (
                <Text style={styles.touchIDText}>TouchID</Text>
              )}
            </View>
          )}
        </View>
        <Text style={{textAlign: 'center', color: 'black'}}>
          {version[buildEnv]}
        </Text>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </Container>
  );
};

export default LoginScreen;

const getStyles = (
  lightGreenText: string,
  blueText: string,
  blackText: string,
) =>
  StyleSheet.create({
    container: {flex: 1},
    faceIdIcon: {
      width: verticalScale(40),
      height: verticalScale(40),
      alignSelf: 'center',
    },
    loginButton: {
      marginVertical: responsiveHeight(20),
      minHeight: responsiveHeight(50),
    },
    loginButtonText: {
      fontSize: typographies.body,
      color: white,
      fontFamily: Fonts.montserratSemiBold,
    },
    inputContainer: {paddingHorizontal: 0},
    input: {
      fontSize: typographies.subhead,
      color: blackText,
      fontFamily: Fonts.montserratRegular,
    },
    header: {
      fontSize: typographies.h3,
      color: blackText,
      fontFamily: Fonts.montserratSemiBold,
      marginBottom: responsiveHeight(10),
    },
    title: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: lightGreenText,
    },
    highlightTitle: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: blueText,
    },
    dialogText: {
      fontSize: typographies.subhead,
      color: primary.color,
      fontFamily: Fonts.montserratMedium,
    },
    touchIDText: {
      color: blackText,
      textAlign: 'center',
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      marginTop: responsiveHeight(10),
    },
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: Layout.window.width,
    },
    icon: {
      height: verticalScale(160),
      width: Layout.window.width - responsiveWidth(32),
      marginBottom: verticalScale(20),
    },
    iconWrapper: {
      justifyContent: 'center',
      flexDirection: 'row',
    },
  });
