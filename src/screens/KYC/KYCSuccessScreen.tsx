import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {verticalScale} from 'react-native-size-matters';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
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

const KYCSuccessScreen = () => {
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const handleGoBack = () => {
    navigation.navigate(RouteKey.SettingScreen, {forceRefresh: Date.now()});
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
        <FastImage
          source={Images.registerSuccessIcon}
          style={styles.successIcon}
          resizeMode="contain"
        />
        <Text style={styles.title}>{localize('verifiedSuccess')}</Text>
        <Text style={styles.title}>{localize('thankYou')}</Text>
      </View>
    </Container>
  );
};

export default KYCSuccessScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    wrapper: {paddingHorizontal: responsiveWidth(16), flex: 1},
    successIcon: {
      width: responsiveWidth(250),
      height: responsiveHeight(300),
      marginTop: responsiveHeight(40),
      alignSelf: 'center',
      marginBottom: responsiveHeight(50),
    },
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
      fontFamily: Fonts.montserratMedium,
      textAlign: 'center',
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
