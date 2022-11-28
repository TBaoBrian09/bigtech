import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import Container from '../../common/Container';
import Images from '../../constants/Images';
import {primary, white} from '../../constants/Colors';
import RouteKey from '../../constants/RouteKey';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import typographies from '../../constants/Typographies';
import {useThemeColor} from '../../common/Themed';
import Fonts from '../../constants/Fonts';
import {localize} from '../../assets/i18n/I18nConfig';
import FastImage from 'react-native-fast-image';

const VerifySuccessScreen = (props: any) => {
  const {isUseEmail, tempUsername} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const handleNavigateLogin = () => {
    navigation.navigate(RouteKey.Login, {
      tempUsername,
      tempIsUseEmail: isUseEmail,
    });
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <View style={styles.wrapper}>
        <FastImage
          source={Images.registerSuccessIcon}
          style={{width: 250, height: 300}}
          resizeMode="contain"
        />
      </View>
      {isUseEmail ? (
        <View style={{flex: 0.5}}>
          <Text style={styles.header}>
            {localize('emailVerificationRequired')}
          </Text>
          <Text style={styles.title}>{localize('pleaseCheckYourMailBox')}</Text>
        </View>
      ) : (
        <View style={{flex: 0.5}}>
          <Text style={styles.header}>{localize('registerSuccess')}</Text>
          <Text style={styles.title}>{localize('loginToStart')}</Text>
        </View>
      )}
      <Button
        title={localize('signIn')}
        onPress={handleNavigateLogin}
        buttonStyle={styles.loginButton}
        titleStyle={styles.loginButtonText}
      />
    </Container>
  );
};

export default VerifySuccessScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: responsiveWidth(32)},
    wrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginButton: {
      marginTop: responsiveHeight(40),
      minHeight: responsiveHeight(44),
      paddingVertical: responsiveHeight(5),
      borderRadius: responsiveWidth(6),
      backgroundColor: primary.color,
      marginBottom: responsiveHeight(15),
    },
    loginButtonText: {
      fontSize: typographies.body,
      color: white,
      fontFamily: Fonts.montserratMedium,
    },
    header: {
      fontSize: typographies.h3,
      color: blackText,
      fontFamily: Fonts.montserratBold,
      marginBottom: responsiveHeight(15),
      textAlign: 'center',
    },
    title: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratRegular,
      color: primary.color,
      textAlign: 'center',
    },
  });
