import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {localize, setLocale} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {LanguageContext} from '../../context/LanguageContext';
import RootStyles from '../../utils/styles';

const LANGUAGE = [
  {icon: Images.usaFlag, title: 'English', code: 'en'},
  {icon: Images.vnFlag, title: 'Tiếng việt', code: 'vn'},
];

const LanguageScreen = () => {
  const navigation = useNavigation();
  const {languageState, setLanguageState} = useContext(LanguageContext);

  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const handleChangeLanguage = (code: string) => {
    setLocale(code);
    setLanguageState(code);
  };

  const handleGoBack = () => {
    navigation.navigate(RouteKey.SettingScreen, {forceRefresh: Date.now});
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <Header
        hasLeft={true}
        title={localize('language')}
        onPressLeft={handleGoBack}
      />
      <View style={{paddingHorizontal: responsiveWidth(15)}}>
        <Text style={styles.section}>{localize('availableForLanguage')}</Text>
        {LANGUAGE.map(item => (
          <TouchableOpacity
            key={item.title}
            style={styles.item}
            onPress={() => handleChangeLanguage(item.code)}>
            <View style={RootStyles.rowStyle}>
              <FastImage
                source={item.icon}
                style={{
                  width: responsiveWidth(40),
                  height: responsiveHeight(20),
                  marginRight: responsiveWidth(10),
                }}
                resizeMode="contain"
              />
              <Text style={styles.title}>{item.title}</Text>
            </View>
            {languageState === item?.code && (
              <Icon source={Images.checkSuccess} size={responsiveWidth(18)} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Container>
  );
};

export default LanguageScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {flex: 1},
    item: {
      ...RootStyles.rowSpaceStyle,
      paddingVertical: responsiveHeight(10),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: blackText,
    },
    section: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      marginVertical: responsiveHeight(10),
    },
    title: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
    },
  });
