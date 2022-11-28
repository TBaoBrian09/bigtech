/* eslint-disable @typescript-eslint/no-unused-vars */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
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
import {LanguageContext} from '../../context/LanguageContext';
import LanguageButton from './components/LanguageButton';

const RegisterOnboardScreen = () => {
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleNavigateRegister = () => {
    navigation.navigate(RouteKey.CountryScreen);
  };
  const {languageState} = React.useContext(LanguageContext);

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}>
      <Header
        hasLeft
        iconLeftColor={primary.color}
        onPressLeft={handleGoBack}
        rightComponent={<LanguageButton />}
      />
      <View style={styles.wrapper}>
        <Icon source={Images.registerOnboardIcon} style={styles.icon} />
        <View style={styles.bottomWrapper}>
          <Text style={styles.title}>{localize('getFreeCryptoNow')}</Text>
          <Text style={styles.subTitle}>
            {localize('chanceToGetCompletelyFreeBTGTokens')}
          </Text>
          <Button
            title={localize('signUp')}
            onPress={handleNavigateRegister}
            buttonStyle={styles.loginButton}
            titleStyle={styles.loginButtonText}
          />
          <TouchableOpacity onPress={handleGoBack}>
            <Text
              style={[
                styles.loginButtonText,
                {color: primary.color, marginVertical: verticalScale(10)},
              ]}>
              {localize('signIn')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default RegisterOnboardScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    wrapper: {paddingHorizontal: responsiveWidth(16), flex: 1},
    bottomWrapper: {
      justifyContent: 'flex-end',
      flex: 1,
      marginBottom: responsiveHeight(15),
    },
    icon: {
      height: verticalScale(240),
      width: Layout.window.width - responsiveWidth(32),
      marginTop: verticalScale(40),
      marginBottom: verticalScale(80),
    },
    loginButton: {
      marginTop: responsiveHeight(85),
      marginBottom: responsiveHeight(10),
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
      textAlign: 'center',
    },
    subTitle: {
      fontSize: typographies.subhead,
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      textAlign: 'center',
      marginTop: responsiveHeight(8),
    },
  });
