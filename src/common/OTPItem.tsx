import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';

import {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../constants/Layout';
import {useThemeColor} from './Themed';
import Fonts from '../constants/Fonts';

type IProps = {
  index: number;
  code: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const getStyles = (blackText: string, grayBg: string) =>
  StyleSheet.create({
    otpWrapper: {
      width: responsiveWidth(44),
      height: responsiveHeight(44),
      marginTop: responsiveHeight(40),
    },
    otpItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: grayBg,
      borderRadius: responsiveWidth(10),
    },
    textCode: {
      fontSize: responsiveFont(20),
      color: blackText,
      fontFamily: Fonts.montserratSemiBold,
    },
  });

export default function OTPItem({
  code,
  style,
  index,
  onPress,
  textStyle,
}: IProps) {
  const blackText = useThemeColor('blackText');
  const primaryColor = useThemeColor('primary');
  const borderGray = useThemeColor('borderLightGray');
  const grayBg = useThemeColor('grayBg');
  const styles = getStyles(blackText, grayBg);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.otpWrapper, style]}>
      <View
        style={[
          styles.otpItem,
          {borderColor: code.length === index ? primaryColor : borderGray},
        ]}>
        {code[index] && (
          <Text style={[styles.textCode, textStyle]}>{code[index]}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
