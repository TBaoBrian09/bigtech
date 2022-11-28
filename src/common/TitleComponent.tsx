import * as React from 'react';
import {Text, View, StyleSheet, StyleProp, TextStyle} from 'react-native';

import Fonts from '../constants/Fonts';
import {responsiveHeight} from '../constants/Layout';
import typographies from '../constants/Typographies';
import {useThemeColor} from './Themed';

interface TitleProps {
  title: string;
  subTitle?: string;
  subTitleStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const TitleComponent = (props: TitleProps) => {
  const {title, subTitle, titleStyle, subTitleStyle} = props;
  const blackText = useThemeColor('blackText');
  const lightGreenText = useThemeColor('lightGreenText');
  const styles = getStyles(blackText, lightGreenText);
  return (
    <View style={styles.container}>
      <Text style={[styles.header, titleStyle]}>{title}</Text>
      {subTitle && (
        <Text style={[styles.title, subTitleStyle]}>{subTitle}</Text>
      )}
    </View>
  );
};

export default TitleComponent;

const getStyles = (blackText: string, lightGreenText: string) =>
  StyleSheet.create({
    container: {},
    header: {
      fontSize: typographies.h3,
      color: blackText,
      fontFamily: Fonts.montserratBold,
      marginBottom: responsiveHeight(10),
    },
    title: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: lightGreenText,
    },
  });
