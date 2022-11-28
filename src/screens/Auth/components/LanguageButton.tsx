import * as React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {scale, verticalScale} from 'react-native-size-matters';

import {setLocale} from '../../../assets/i18n/I18nConfig';
import {useThemeColor} from '../../../common/Themed';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import {LanguageContext} from '../../../context/LanguageContext';

interface LanguageButtonProps {
  style?: StyleProp<ViewStyle>;
}

const LanguageButton = (props: LanguageButtonProps) => {
  const lightGray = useThemeColor('lightGray');
  const grayText = useThemeColor('grayText');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(lightGray, grayText, blackText);

  const {languageState, setLanguageState} = React.useContext(LanguageContext);

  const handleChangeLanguage = () => {
    if (languageState === 'vn') {
      setLocale('en');
      setLanguageState('en');
    } else {
      setLocale('vn');
      setLanguageState('vn');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.languageButton, props.style]}
      onPress={handleChangeLanguage}>
      <FastImage
        source={languageState === 'vn' ? Images.vnFlag : Images.usaFlag}
        resizeMode="cover"
        style={styles.image}
      />
      <Text style={styles.languageText}>
        {languageState === 'vn' ? 'VN' : 'EN'}
      </Text>
    </TouchableOpacity>
  );
};

export default LanguageButton;

const getStyles = (lightGray: string, grayText: string, blackText: string) =>
  StyleSheet.create({
    container: {},
    image: {
      width: verticalScale(14),
      height: verticalScale(14),
      borderRadius: verticalScale(20),
      marginRight: verticalScale(5),
    },
    languageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(4),
      borderRadius: verticalScale(20),
      backgroundColor: lightGray,
      borderWidth: 1,
      borderColor: grayText,
      alignSelf: 'flex-end',
      minHeight: verticalScale(32),
    },
    languageText: {
      fontSize: typographies.footnote,
      color: blackText,
      fontFamily: Fonts.montserratMedium,
    },
  });
