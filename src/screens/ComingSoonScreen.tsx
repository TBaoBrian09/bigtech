import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import Container from '../common/Container';
import Header from '../common/Header';
import RouteKey from '../constants/RouteKey';
import {primary, white} from '../constants/Colors';
import Icon from '../common/Icon';
import Images from '../constants/Images';
import Layout, {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../constants/Layout';
import {useThemeColor} from '../common/Themed';
import typographies from '../constants/Typographies';
import Fonts from '../constants/Fonts';
import RootStyles from '../utils/styles';
import {localize} from '../assets/i18n/I18nConfig';

const ComingSoonScreen = () => {
  const navigation = useNavigation();

  const yellow = useThemeColor('yellow');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText, yellow);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  const backAction = () => {
    return true;
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}>
      <ScrollView>
        <Header
          hasBackButton={false}
          leftComponent={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  RouteKey.SettingScreen as never,
                  {} as never,
                )
              }>
              <Icon
                source={Images.profileIcon}
                style={{
                  width: responsiveWidth(24),
                  height: responsiveWidth(24),
                }}
              />
            </TouchableOpacity>
          }
          rightStyle={{flex: 1}}
        />
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <Text style={styles.asset}>{localize('maintenance')}</Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default ComingSoonScreen;

const getStyles = (blackText: string, yellow: string) =>
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: responsiveWidth(15)},
    headerWrapper: {alignItems: 'center', justifyContent: 'center'},
    menuWrapper: {
      ...RootStyles.rowStyle,
      marginTop: responsiveHeight(25),
      marginBottom: responsiveHeight(15),
    },
    customItem: {
      backgroundColor: white,
      marginBottom: responsiveHeight(5),
      borderBottomWidth: 0.2,
      borderBottomColor: blackText,
    },
    menuItem: {
      minWidth: responsiveWidth(130),
      alignItems: 'center',
      justifyContent: 'center',
      height: responsiveHeight(34),
      backgroundColor: yellow,
      borderRadius: responsiveWidth(5),
      marginRight: responsiveHeight(7),
    },
    line: {
      height: 0.2,
      width: Layout.window.width - responsiveWidth(15),
      backgroundColor: blackText,
      marginBottom: responsiveHeight(7),
    },
    getStarted: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.footnote,
      alignSelf: 'center',
      marginTop: responsiveHeight(15),
      marginBottom: responsiveHeight(12),
      textTransform: 'uppercase',
      color: blackText,
    },
    menuBorder: {
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
      borderLeftColor: white,
      borderRightColor: white,
    },
    asset: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratBold,
      color: blackText,
      marginBottom: responsiveHeight(25),
    },
    title: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: '#606060',
    },
    buy: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
    },
    amount: {
      fontSize: responsiveFont(25),
      fontFamily: Fonts.montserratBold,
      color: primary.color,
      marginTop: responsiveHeight(10),
    },
    assetTitle: {
      fontSize: typographies.h3,
      fontFamily: Fonts.montserratBold,
      color: blackText,
      marginTop: responsiveHeight(30),
      marginBottom: responsiveHeight(15),
    },
  });
