/* eslint-disable @typescript-eslint/no-unused-vars */
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {verticalScale} from 'react-native-size-matters';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import DotItem from './components/DotItem';

const DETAIL = [
  localize('personalInformation'),
  localize('paymentMethod'),
  localize('IDCard'),
  localize('record'),
];

const KYCOnboardingScreen = () => {
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const handleGoBack = () => {
    navigation.navigate(RouteKey.SettingScreen);
  };
  const handleNavigation = () => {
    navigation.navigate(RouteKey.PersonalInformationScreen);
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
      />
      <View style={styles.wrapper}>
        <Icon source={Images.kycBackgroundIcon} style={styles.icon} />
        <View style={styles.bottomWrapper}>
          <Text style={styles.title}>{localize('accountVerification')}</Text>
          <Text style={styles.subTitle}>{localize('beginVerification')}</Text>
          {DETAIL?.map(item => (
            <DotItem key={item} title={item} />
          ))}
        </View>
      </View>
      <Button
        title={localize('start')}
        onPress={handleNavigation}
        buttonStyle={styles.loginButton}
        titleStyle={styles.loginButtonText}
      />
    </Container>
  );
};

export default KYCOnboardingScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    wrapper: {paddingHorizontal: responsiveWidth(16), flex: 1},
    bottomWrapper: {
      justifyContent: 'flex-end',
      marginBottom: responsiveHeight(15),
    },
    icon: {
      height: verticalScale(200),
      width: Layout.window.width - responsiveWidth(32),
      marginTop: verticalScale(40),
      marginBottom: verticalScale(40),
    },
    loginButton: {
      marginBottom: responsiveHeight(15),
      marginHorizontal: responsiveWidth(15),
      minHeight: responsiveHeight(40),
      borderRadius: responsiveWidth(6),
      backgroundColor: primary.color,
    },
    loginButtonText: {
      fontSize: typographies.body,
      color: white,
      fontFamily: Fonts.montserratSemiBold,
      textAlign: 'center',
    },
    title: {
      fontSize: typographies.body,
      color: blackText,
      fontFamily: Fonts.montserratSemiBold,
      textAlign: 'left',
      marginBottom: responsiveHeight(8),
    },
    subTitle: {
      fontSize: typographies.subhead,
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      textAlign: 'left',
      lineHeight: responsiveHeight(20),
    },
  });
