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

interface IProps {
  route?: any;
}

const RejectedScreen = (props: IProps) => {
  const {rejectedReson} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleNavigation = () => {
    navigation.navigate(RouteKey.KYCOnboardingScreen);
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
        <Icon source={Images.errorIcon} style={styles.icon} />
        <Text style={styles.title}>{localize('rejected')}</Text>
        <Text style={styles.subTitle}>{rejectedReson}</Text>
      </View>
      <Button
        title={localize('tryAgain')}
        onPress={handleNavigation}
        buttonStyle={styles.loginButton}
        titleStyle={styles.loginButtonText}
      />
    </Container>
  );
};

export default RejectedScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    wrapper: {
      paddingHorizontal: responsiveWidth(16),
      flex: 1,
      alignItems: 'center',
    },
    icon: {
      height: responsiveHeight(80),
      width: responsiveHeight(80),
      marginTop: responsiveHeight(20),
      marginBottom: verticalScale(40),
      alignSelf: 'center',
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
      color: 'red',
      fontFamily: Fonts.montserratMedium,
      marginBottom: responsiveHeight(15),
    },
    subTitle: {
      fontSize: typographies.subhead,
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      lineHeight: responsiveHeight(20),
    },
  });
